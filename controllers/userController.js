const {createM3u8File} = require("../utils/file");
const {createAlbumCoverUrl} = require("../utils/file");
const {RadioError} = require("../utils/RadioError");
const {userProxy} = require('../proxies/userProxy');
const {JWT} = require('../utils/jwt');
const {UsersSongsProxy} = require('../proxies/usersSongsProxy')
const {SongProxy} = require('../proxies/songProxy')
const {postman} = require('../utils/sendResponse')

const who = async (req, res, next) => {
    res.send(JWT.verifyAccess(req.header('Access-Token')));
}


const addSong = (req, res, next) => {
    const user = JWT.verifyAccess(req.header('Access-Token'));
    const {songId} = req.params;
    UsersSongsProxy.addSongToUser(songId, user.id)
        .then(result => {
            console.log(result);
            res.send(result);
        })
        .catch(error => {
            console.log('ERROR: UsersSongsProxy.addSongToUser');
            console.log(error);
            next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
        });
}

const deleteSong = (req, res, next) => {
    const user = JWT.verifyAccess(req.header('Access-Token'));
    const {songId} = req.params;
    UsersSongsProxy.deleteUsersSong(songId, user.id)
        .then(result => {
            console.log(result);
            postman.sendResponse(res, 'Song Deleted');
        })
        .catch(error => {
            console.log(error);
            next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
        })
}

const favourites = (req, res, next) => {
    const user = JWT.verifyAccess(req.header('Access-Token'));
    SongProxy.favourites(user.id)
        .then(result => {
            res.send(result[0].map(item => {
                return {
                    id: item.ID,
                    albumId: item.ALBUM_ID,
                    songName: item.SONG_NAME,
                    artistName: item.ARTIST_NAME,
                    albumName: item.ALBUM_NAME,
                    cover: createAlbumCoverUrl(item.ALBUM_ID, 250, 's'),
                    m3u8: createM3u8File(item.ARTIST_ID, item.ALBUM_ID, item.ID),
                    isAdded: item.ADD ? item.ADD : -1
                }
            }));
        }).catch(error => {
        console.log(error);
        console.log('ERROR: SongProxy.favourites');
        next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
    });
}
module.exports = {
    who: who,
    addSong: addSong,
    deleteSong: deleteSong,
    favourites: favourites
}