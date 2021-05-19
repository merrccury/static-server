const axios = require("axios");
const fs = require("fs");
const sharp = require('sharp');
const spawn = require('child_process').spawn;
const {
    createStaticSongM4aPath,
    createStaticSongPath,
    createStaticSongM3u8Path,
    createStaticSongAACPath
} = require("../utils/dirictories");

const download_image = (url, image_path) =>
    axios({
        url,
        responseType: 'stream',
    }).then(
        response =>
            new Promise((resolve, reject) => {
                response.data
                    .pipe(fs.createWriteStream(image_path))
                    .on('finish', () => resolve())
                    .on('error', e => reject(e));
            }),
    );

const m4aToM3u8Svc = ({artistId, albumId, id}) => {
    let m4aFile = createStaticSongM4aPath(artistId, albumId, id);
    let m3u8File = createStaticSongM3u8Path(artistId, albumId, id);
    let accFile = createStaticSongAACPath(artistId, albumId, id);

    console.log(m4aFile, m3u8File, accFile);

    return new Promise(((resolve, reject) => {
        let ls = spawn('ffmpeg', ['-i', `${m4aFile}`, '-vn',
            '-ac', '2', '-acodec', 'aac', '' +
            '-f', 'segment', '-segment_format', 'mpegts',
            '-segment_time', '2', '-segment_list', `${m3u8File}`, `${accFile}`]);

        //ls.stdout.on('data', (data) => console.log(`stdout: ${data}`));
        //ls.stderr.on('data', (data) => console.log(`stderr: ${data}`));

        ls.on('close', (code) => {
            if (code === 0) {
                fs.readFile(m3u8File, 'utf-8', (err, data) => {
                    let partitionArray = [[], []];
                    data = data.split('\n');
                    data.forEach(item => {
                        if (item.includes('#EXTINF')) {
                            let beforeDot = item.substr(8, 1);
                            let afterDot = item.substring(10);
                            partitionArray[0].push(parseInt(beforeDot + afterDot));
                        }
                        else if (item.includes('.aac')) {
                            partitionArray[1].push(item);
                        }
                    });
                    resolve(partitionArray);
                });
            } else {
                reject({
                    status: 'error',
                    message: `Child process status code is ${code}`
                })
            }
        });
    }))
}

const rmdir = (artistPath) => {
    fs.rmdir(artistPath, {recursive: true}, (err) => {
        if (err)
            console.log('---> ERROR: fs.rmdir');
    });
}

const circle = (w, h) => new Buffer(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 100 100">
            <circle r="50" cx="50" cy="50" fill-opacity="1.0"/>
        </svg>`
);

const imageFormatter = (path, size, attr) => {
    return attr === 'c'
        ?
        sharp(path)
            .resize(size, size)
            .composite([{
                input: circle(size, size),
                gravity: 'centre',
                blend: 'dest-in'
            }])
            .png()
        :
        sharp(path)
            .resize(size, size)
            .png();
}

//todo change hostname
const createArtistCoverUrl = id => `https://api.gspp.space/api/artist/cover?id=${id}&size=500&attr=c`;
const createAlbumCoverUrl = (id, size = 500, attr = 'c') => `https://api.gspp.space/api/album/cover?id=${id}&size=${size}&attr=${attr}`;
const createM3u8File = (artistId, albumId, songId) => `https://api.gspp.space/api/song/m3u8/${artistId}/${albumId}/${songId}/${songId}.m3u8`

module.exports = {download_image, rmdir, imageFormatter, createArtistCoverUrl, createAlbumCoverUrl, m4aToM3u8Svc, createM3u8File};