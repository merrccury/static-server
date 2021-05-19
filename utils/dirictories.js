const path = require('path');


//const rootPath = "D:\\OneDrive\\BSTU\\3-k-2-s\\vs-radio-plus\\static-server";
const rootPath = '/rario-plus/static-server';

const createStaticPath = (part) => path.join(rootPath, part);
const createStaticImagePath = (fullPath, id) => path.join(fullPath, `${id}.jpg`);
const createStaticArtistPath = (id) => path.join(rootPath, `/static/artists/${id}`);
const createStaticArtistImagePath = (id) => path.join(createStaticArtistPath(id), `/${id}.jpg`);
const createStaticSongPath = (artistId, albumId, songId) => path.join(rootPath, `/static/artists/${artistId}/${albumId}/${songId}`);
const createStaticSongM4aPath = (artistId, albumId, songId) => path.join(rootPath, `/static/artists/${artistId}/${albumId}/${songId}/${songId}.m4a`);
const createStaticSongM3u8Path = (artistId, albumId, songId) => path.join(rootPath, `/static/artists/${artistId}/${albumId}/${songId}/${songId}.m3u8`);
const createStaticSongAACPath = (artistId, albumId, songId) => path.join(rootPath, `/static/artists/${artistId}/${albumId}/${songId}/${songId}-%05d.aac`);
const createStaticSongAACPathN = (artistId, albumId, songId, aac) => path.join(rootPath, `/static/artists/${artistId}/${albumId}/${songId}/${aac}`);
const createFilePath = (artistId, albumId, songId, file) => path.join(rootPath, `/static/artists/${artistId}/${albumId}/${songId}/${file}`);
const createStaticStationPath = () => path.join(rootPath, '/stations');
const createStaticPlaylist = (id) => path.join(rootPath, `static/stations/${id}.m3u8`);
const createStaticStationPlaylist = (id) => path.join(rootPath, `static/stations/${id}/${id}.m3u8`);
module.exports = {
    createStaticPath,
    createStaticImagePath,
    createStaticArtistPath,
    createStaticArtistImagePath,
    createStaticSongM4aPath,
    createStaticSongPath,
    createStaticSongM3u8Path,
    createStaticSongAACPath,
    createStaticSongAACPathN,
    createFilePath,
    createStaticStationPath,
    createStaticStationPlaylist,
    createStaticPlaylist
}