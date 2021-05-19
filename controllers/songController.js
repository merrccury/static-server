const {RadioError} = require('../utils/RadioError');
const superagent = require('superagent');
const spawn = require('child_process').spawn;
const {access} = require('fs/promises');
const fs = require("fs");
const path = require("path");
const {JWT} = require("../utils/jwt");
const {createAlbumCoverUrl, createM3u8File} = require("../utils/file");

const {SongProxy} = require('../proxies/songProxy');
const {PartitionProxy} = require('../proxies/partitionProxy');
const {UsersSongsProxy} = require('../proxies/usersSongsProxy');
const {download_image, rmdir, imageFormatter, m4aToM3u8Svc} = require('../utils/file')
const {
    createStaticSongM3u8Path,
    createStaticSongPath,
    createStaticSongM4aPath,
    createStaticSongAACPathN,
    createStaticArtistPath,
    createFilePath
} = require('../utils/dirictories')

const addSong = (req, res, next) => {
    const {songId} = req.params;
    superagent.get('https://itunes.apple.com/lookup')
        .query({
            id: songId,
            entity: 'song'
        })
        .end(async (error, response) => {
            if (error) {
                next(new RadioError('Song not found', 400, 'error'));
            } else {
                try {
                    const {resultCount, results} = JSON.parse(response.text);
                    if (!resultCount && !results) {
                        next(new RadioError('Song not found', 400, 'error'));
                    } else {
                        const song = {
                            id: results[0].trackId,
                            albumId: results[0].collectionId,
                            artistId: results[0].artistId,
                            songName: results[0].trackName,
                            appleMusicUpl: results[0].trackViewUrl,
                            m4a: results[0].previewUrl
                        }
                        //await access(createStaticArtistPath(song.artistId), fs.constants.R_OK );
                        //await access(createStaticArtistPath(`${song.artistId}\\${song.albumId}`), fs.constants.F_OK);

                        fs.access(createStaticArtistPath(song.artistId), error => {
                            if (error) {
                                console.log('no access: Artist first')
                                next(new RadioError('You need to add artist first', 400, 'error'));
                            }
                        })

                        console.log(createStaticArtistPath(`${song.artistId}\\${song.albumId}`));

                        fs.access(createStaticArtistPath(`${song.artistId}\\${song.albumId}`), error => {
                            if (error) {
                                console.log('no access: Album first')
                                next(new RadioError('You need to add album first', 400, 'error'));
                            }
                        })
                        song.m3u8 = createStaticSongM3u8Path(song.artistId, song.albumId, song.id);
                        fs.access(createStaticSongPath(song.artistId, song.albumId, song.id), (error) => {
                            if (error) {
                                console.log(createStaticSongPath(song.artistId, song.albumId, song.id));
                                fs.mkdir(createStaticSongPath(song.artistId, song.albumId, song.id), {recursive: true}, (error) => {
                                    if (error) {
                                        console.log('---> ERROR: fs.mkdir');
                                        next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
                                    } else {
                                        download_image(song.m4a, createStaticSongM4aPath(song.artistId, song.albumId, song.id))
                                            .then(result => {
                                                m4aToM3u8Svc(song)
                                                    .then(result => {

                                                        const [durations, aacS] = result;
                                                        console.log(durations);
                                                        console.log(aacS);
                                                        const partitions = durations.map((duration, index) => {
                                                            const AAC = createStaticSongAACPathN(song.artistId, song.albumId, song.id, aacS[index]);
                                                            return {
                                                                ID: 1,
                                                                ACC: AAC,
                                                                SEQUENCE: index,
                                                                DURATION: duration,
                                                                SONG_ID: song.id
                                                            }
                                                        });
                                                        SongProxy.addSong(song).then(result => {
                                                            //console.log(partitions);
                                                            PartitionProxy.addPartitions(partitions)
                                                                .then(result => {
                                                                    res.send({
                                                                        song: song.songName
                                                                    })
                                                                })
                                                                .catch(error => {
                                                                    console.log('ERROR: PartitionProxy.addPartitions');
                                                                    console.log(error);
                                                                    rmdir(createStaticSongPath(song.artistId, song.albumId, song.id))
                                                                    next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
                                                                })
                                                        })
                                                            .catch(error => {
                                                                console.log('ERROR: SongProxy.addSong');
                                                                console.log(error);
                                                                rmdir(createStaticSongPath(song.artistId, song.albumId, song.id))
                                                                next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
                                                            })
                                                    })
                                                    .catch(error => {
                                                        console.log('ERROR: m4aToM3u8Svc');
                                                        console.log(error);
                                                        rmdir(createStaticSongPath(song.artistId, song.albumId, song.id))
                                                        next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
                                                    })
                                            })
                                            .catch(error => {
                                                console.log('ERROR: download_image');
                                                console.log(error);
                                                rmdir(createStaticSongPath(song.artistId, song.albumId, song.id))
                                                next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
                                            })
                                    }
                                })
                            } else {
                                next(new RadioError('Song already exist', 400, 'error'));
                            }
                        });
                    }
                } catch (e) {
                    next(new RadioError(e.message, 400, 'error'));
                }
            }
        });
}

const getSong = (req, res, next) => {

}

const deleteSong = (req, res, next) => {

}

const m3u8 = (req, res, next) => {
    const {artistId, albumId, songId, file} = req.params;
    const fullPath = createFilePath(artistId, albumId, songId, file)
    if (file.includes('m3u8'))
        res.header('Content-Type', 'application/vnd.apple.mpegurl')
    else
        res.header('Content-Type', 'audio/aac')
    res.sendFile(fullPath);
}

const search = (req, res, next) => {
    const {term} = req.query;
    let searchResult = [];
    SongProxy.search(term)
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
        console.log('ERROR: SongProxy.search');
        next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
    });
}

const parse = (req, res, next) => {
    const {albumId} = req.params;
    superagent.get('https://itunes.apple.com/lookup')
        .query({
            id: albumId,
            entity: 'song',
            country: 'us'
        })
        .end((error, response) => {
            if (error) {
                next(new RadioError('Album not found', 400, 'error'));
            } else {
                const obj = JSON.parse(response.text);
                res.send(obj);
            }
        });
}

const checkSong = (req, res, next) => {
    const user = JWT.verifyAccess(req.header('Access-Token'));
    const {songId} = req.params;
    console.log(user.id, parseInt(songId));
    UsersSongsProxy.checkSong(songId, user.id)
        .then(result => {
            console.log(result);
                res.send({
                    status: result.count === 1
                })
        })
        .catch(error => {
            console.log(error);
            res.send({
                status: 0
            })
        })
}

module.exports = {
    addSong: addSong,
    getSong: getSong,
    deleteSong: deleteSong,
    m3u8: m3u8,
    search: search,
    parse: parse,
    checkSong:checkSong
}