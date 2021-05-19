const {JWT} = require("../utils/jwt");
const {StationProxy} = require('../proxies/stationProxy');
const {PartitionProxy} = require('../proxies/partitionProxy');
const {PafProxy} = require('../proxies/partitionOfStationProxy');
const {SongProxy} = require('../proxies/songProxy');
const {createStaticStationPlaylist, createStaticPlaylist} = require('../utils/dirictories')
const path = require('path');
const schedule = require('node-schedule');
fs = require('fs');
const socket = require('../socket');
const {createAlbumCoverUrl} = require("../utils/file");


const addStation = (req, res, next) => {
    const user = JWT.verifyAccess(req.header('Access-Token'));
    const {songs, title, date} = req.body;
    const model = {
        ID: 0,
        CREATOR: user.id,
        DATE_OF_CREATURE: new Date(),
        DATE_OF_AVAILABILITY: date,
        TITLE: title,
        URL: '-'
    }
    console.log(model.DATE_OF_CREATURE.getTime());
    console.log(model.DATE_OF_CREATURE);
    model.ID = parseInt(`${model.DATE_OF_CREATURE.getTime()}${model.CREATOR}`);
    const fileName = createStaticPlaylist(`${model.ID}`);
    console.log('fileName', fileName);
    //todo change hostname
    model.URL = `https://api.gspp.space/api/station/${model.ID}/${model.ID}.m3u8`;


    StationProxy.addStation(model)
        .then(async result => {

            let m3u8Partitions = []
            for (let item of songs) {
                let partitions = await PartitionProxy.getPartitions(item);
                partitions = partitions.map(item => item.dataValues);
                m3u8Partitions = [...m3u8Partitions, ...partitions];
            }
            console.log(m3u8Partitions);
            //m3u8Partitions = m3u8Partitions.filter(item => item.SEQUENCE !== '14' && item.SEQUENCE !== '0');
            console.log(m3u8Partitions);
            let partitionSequence = 0;
            const partitionOfStation = m3u8Partitions.map(item => {
                return {
                    ID: -1,
                    STATION_ID: model.ID,
                    SONG_ID: item.SONG_ID,
                    PARTICLE: item.ID,
                    PARTITION_NAME: `${model.ID}_${++partitionSequence}`
                }
            })

            await PafProxy.addPOS(partitionOfStation);

            const end = '...\n#EXT-X-ENDLIST\n';

            console.log(date);

            let sequence = 0;

            const job = schedule.scheduleJob({start: date, rule: '*/6 * * * * *'}, function () {
                const begin = "#EXTM3U\n" +
                    "#EXT-X-VERSION:5\n" +
                    `#EXT-X-MEDIA-SEQUENCE:${sequence}\n` +
                    "#EXT-X-TARGETDURATION:2\n";

                //const newBegin = `#EXTM3U\n#EXT-X-VERSION:6\n#EXT-X-TARGETDURATION:2\n#EXT-X-ALLOW-CACHE:NO\n#EXT-X-MEDIA-SEQUENCE:${sequence += 3}\n`

                const new_begin = `#EXTM3U
#ENCODER:StreamS Live HTTP Encoder v3.2.1.174
#EXT-X-VERSION:5
#EXT-X-MEDIA-SEQUENCE:${sequence += 3}
#EXT-X-TARGETDURATION:2\n`


                /* const transformation = item => {
                     const file = path.win32.basename(item.ACC);
                     let duration = item.DURATION.toString();
                     duration = `${duration[0]}.${duration.substring(1, duration.length - 1)}`
                     return `#EXTINF:${duration},\n${file}\n`;
                 }

                 const one = transformation(m3u8Partitions.shift());
                 const two = transformation(m3u8Partitions.shift());
                 const three = transformation(m3u8Partitions.shift());
                 */

                const getDuration = (item) => {
                    let duration = item.DURATION.toString();
                    duration = `${duration[0]}.${duration.substring(1, duration.length - 1)}`
                    return duration;
                }
                const transformation = (duration, pof) => `#EXTINF:${duration},\n${pof.PARTITION_NAME}.acc\n`;

                console.log(m3u8Partitions.length, partitionOfStation.length, m3u8Partitions.length % 15 === 0);

                if (m3u8Partitions.length % 15 === 0) {
                    console.log('-------------------------------------->')
                    /*m3u8Partitions.shift();
                    partitionOfStation.shift();*/
                }
                const one = transformation(getDuration(m3u8Partitions.shift()), partitionOfStation.shift())
                const pof = partitionOfStation.shift();
                const two = transformation(getDuration(m3u8Partitions.shift()), pof);
                const three = transformation(getDuration(m3u8Partitions.shift()), partitionOfStation.shift())

                SongProxy.getSong(parseInt(pof.SONG_ID)).then(result => {
                    socket.sendPlayerInfo({
                        ALBUM_ID: result[0].ALBUM_ID,
                        TITLE: model.TITLE,
                        ID: model.ID,
                        SONG_ID: pof.SONG_ID,
                        SONG_NAME: result[0].SONG_NAME,
                        ARTIST_NAME: result[0].ARTIST_NAME,
                    })
                })
                    .catch(error => {
                        console.log('SongProxy.getSong')
                        console.log(error);
                    })


                /* let one, two, three
                 if(m3u8Partitions.length === 1){
                     one = transformation(getDuration(m3u8Partitions.shift()), partitionOfStation.shift())
                     two = ''
                     three = ''
                 }
                 else if(m3u8Partitions.length === 2){
                     one = transformation(getDuration(m3u8Partitions.shift()), partitionOfStation.shift())
                     two = transformation(getDuration(m3u8Partitions.shift()), partitionOfStation.shift())
                     three = ''
                 }
                 else {
                     one = transformation(getDuration(m3u8Partitions.shift()), partitionOfStation.shift())
                     two = transformation(getDuration(m3u8Partitions.shift()), partitionOfStation.shift())
                     three = transformation(getDuration(m3u8Partitions.shift()), partitionOfStation.shift())
                 }*/


                const file = new_begin + one + two + three;

                console.log(file);

                fs.writeFile(fileName, file, error => {
                    if (error) {
                        console.log('error ----> ', error)
                    }
                });

                if (m3u8Partitions.length === 0) {
                    console.log(begin + end, file);
                    socket.sendDefaultPlayerInfo(model.ID)
                    setTimeout(async (id) => {
                        await PafProxy.deletePOF(parseInt(id));
                        await StationProxy.deleteStation(parseInt(id));
                        socket.sendDefaultPlayerInfo(id)
                    }, 9000, model.ID)
                    job.cancel();
                }
            });

            /*console.log(m3u8Partitions);
            const reducer = (accumulator, currentValue) => {
                const file = path.win32.basename(currentValue.ACC);
                let duration = currentValue.DURATION.toString();
                duration = `${duration[0]}.${duration.substring(1, duration.length - 1)}`
                return accumulator + `#EXTINF:,${duration},\n${file}\n`;
            }


            const playlist = m3u8Partitions.reduce(reducer, begin)*/


            res.send(result);
            console.log('then', result);
        })
        .catch(error => {
            res.send(error);
            console.log('error', error);
        })
}

const getStations = (req, res, next) => {
    const user = JWT.verifyAccess(req.header('Access-Token'));
    StationProxy.getStations()
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.send(error);
        })
}

const m3u8 = async (req, res, next) => {
    const {playlist, file} = req.params;
    if (file.includes('m3u8')) {
        //console.log('m3u8');
        res.header('Content-Type', 'application/vnd.apple.mpegurl');
        res.sendFile(createStaticPlaylist(playlist));

    } else {
        //console.log('aac');
        res.header('Content-Type', 'audio/aac')
        let [songId, sequence] = file.substr(0, file.length - 4).split('-');
        const partition = await PafProxy.getAAC(songId, playlist);
        res.sendFile(partition[0][0].ACC);
    }

}

module.exports = {
    addStation: addStation,
    getStations: getStations,
    m3u8: m3u8
}