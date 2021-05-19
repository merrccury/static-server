const {Songs, Albums, Artists, sequelize, QueryTypes} = require('../models');

const addSong = (song) => {
    const songModel = {
        ID: song.id,
        ALBUM_ID: song.albumId,
        ARTIST_ID: song.artistId,
        M3U8: song.m3u8,
        SONG_NAME: song.songName,
        APPLE_MUSIC_URL: song.appleMusicUpl,
    }
    return Songs.create(songModel);
}

const search = term => sequelize.query(`SELECT S.ID, S.SONG_NAME, AR.ARTIST_NAME, A.ALBUM_NAME, S.ALBUM_ID, S.ARTIST_ID, US.USER_ID AS 'ADD'
FROM SONGS S
         INNER JOIN ARTISTS AR ON S.ARTIST_ID = AR.ID
         INNER JOIN ALBUMS A on S.ALBUM_ID = A.ID
         LEFT OUTER JOIN USERS_SONGS US on S.ID = US.SONG_ID
WHERE s.SONG_NAME LIKE '%${term}%';`)

const favourites = id => sequelize.query(`SELECT S.ID, S.SONG_NAME, AR.ARTIST_NAME, A.ALBUM_NAME, S.ALBUM_ID, S.ARTIST_ID, US.USER_ID AS 'ADD'
FROM SONGS S
         INNER JOIN ARTISTS AR ON S.ARTIST_ID = AR.ID
         INNER JOIN ALBUMS A on S.ALBUM_ID = A.ID
         INNER JOIN USERS_SONGS US on S.ID = US.SONG_ID
WHERE US.USER_ID = ${id}`)

const getSong = id => sequelize.query(`SELECT S.ID as 'SONG_ID', S.SONG_NAME, AR.ARTIST_NAME, A.ALBUM_NAME, A.ID AS 'ALBUM_ID'
FROM SONGS S
         INNER JOIN ARTISTS AR ON S.ARTIST_ID = AR.ID
         INNER JOIN ALBUMS A on S.ALBUM_ID = A.ID
         LEFT OUTER JOIN USERS_SONGS US on S.ID = US.SONG_ID
WHERE S.ID = :songId`, {
    replacements: {songId: id},
    type: QueryTypes.SELECT
})

const coverAndM3u8 = id => sequelize.query('SELECT S.M3U8, A.COVER\n' +
    'FROM SONGS S\n' +
    '         INNER JOIN ALBUMS A\n' +
    'WHERE S.ALBUM_ID = A.ID AND S.ID = :id;\n',
    {
        replacements: {id: id},
        type: QueryTypes.SELECT
    }
);

const SongProxy = {
    addSong: addSong,
    search: search,
    favourites: favourites,
    getSong: getSong
}

module.exports = {SongProxy: SongProxy}


