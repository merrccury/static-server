const {UsersSongs} = require('../models');

const addSongToUser = (songId, userId) => UsersSongs.create({
    ID: parseInt(songId),
    USER_ID: userId,
    SONG_ID: parseInt(songId)
});

const deleteUsersSong = async (songId, userId) => UsersSongs.destroy({
        where: {
            USER_ID: userId,
            SONG_ID: songId
        }
    });

const checkSong = (songId, userId) =>UsersSongs.findAndCountAll({
    where: {
        USER_ID: userId,
        SONG_ID: songId
    }
});


const UsersSongsProxy = {
    addSongToUser: addSongToUser,
    deleteUsersSong:deleteUsersSong,
    checkSong:checkSong
}

module.exports = {UsersSongsProxy: UsersSongsProxy}



