import fetch from 'node-fetch';
import argv from 'minimist';
import sharp from 'sharp';
import {writeFile} from 'fs';
import {join} from 'path';

let {
    greeting = 'Hello', who = 'You', width = 400, height = 500, color = 'Pink', size = 100,
} = argv;


let firstReq = {
// https://cataas.com/cat/says/Hi%20There?width=500&amp;height=800&amp;c=Cyan&amp;s=150
    url: 'https://cataas.com/cat/says/' + greeting + '?width=' + width + '&height=' + height + '&color' + color + '&s=' + size,
    encoding: 'binary'
};

let secondReq = {
    url: 'https://cataas.com/cat/says/' + who + '?width=' + width + '&height=' + height + '&color' + color + '&s=' + size,
    encoding: 'binary'
};

async function blendImages() {
    await fetch(firstReq.url).then((res) => {
        if (!res.ok) {
            throw Error(`An error has occurred first req: ${res.status}`);
        }

        let firstBody = res;

        fetch(secondReq.url).then((res) => {
            if (!res.ok) {
                throw Error(`An error has occurred first req: ${res.status}`);
            }
            let secondBody = res;

            sharp([{
                buffer: Buffer.from(JSON.stringify(firstBody)), x: 0, y: 0
            }, {
                buffer: Buffer.from(JSON.stringify(secondBody)),
                x: width,
                y: 0
            }]).resize(width * 2, height).toFile('image.jpeg', (err, info) => {
                const fileOut = join(process.cwd(), `/cat-card.jpg`);

                writeFile(fileOut, info, 'binary', (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log("The file was saved!");
                });
            });

        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
}


blendImages().then(data => {
    console.log(data);
}).catch(error => {
    console.log(error);
});

