const nodeSchedule = require("node-schedule");
const {StationProxy} = require("./proxies/stationProxy");
const {createAlbumCoverUrl} = require("./utils/file");
let io = null;

exports.io = () => io;

exports.initialize = (socket) => {
    io = socket;

    nodeSchedule.scheduleJob('*/1 * * * *', async () => {
        console.log('nodeSchedule.cancelJob');
        const stations = await StationProxy.getStations();
        sendNotification(stations);
    })

    io.sockets.on('connection', socket => {
        socket.on('create', room => {
            console.log(room);
            console.log('new connection')
            socket.join(room);
        });

        socket.on('notification', room => {
            console.log('new notification');
            socket.join(`notification_${room}`);
        })

    });

}

const sendNotification = stations => {
    stations.filter(item => {
        const dateOfAv = new Date(item.DATE_OF_AVAILABILITY);
        const timeInMsec = Date.now() + 300000;
        return dateOfAv.getTime() < timeInMsec && dateOfAv.getTime() > Date.now();
    }).forEach(station => {
        io.sockets.in(`notification_${station.ID}`).emit('notification', `Stream ${station.TITLE} will start soon`);
    })
}

exports.sendNotification = sendNotification;

exports.sendPlayerInfo = (model) => {
    console.log(model);
    io.sockets.in(model.ID).emit('current', {
        m3u8: '',
        cover: createAlbumCoverUrl(model.ALBUM_ID, 250, 's'),
        station: {
            name: model.TITLE,
            id: model.ID
        },
        song: {
            songName: model.SONG_NAME,
            songId: model.SONG_ID,
            artistName: model.ARTIST_NAME
        },
        add: true,
        play: true
    });
}

exports.sendDefaultPlayerInfo = (station) => {
    io.sockets.in(station).emit('current', {
        m3u8: '',
        //todo change hostname
        cover: ':https://api.gspp.space/images/radio.svg',
        station: {
            name: 'Station+',
            id: -1
        },
        song: {
            songName: '•',
            artistName: '•'
        },
        add: true,
        play: true
    });
}