const {RadioError} = require('../utils/RadioError');
const superagent = require('superagent');
const fs = require("fs");
const {download_image, rmdir, imageFormatter, createAlbumCoverUrl} = require('../utils/file')
const {createStaticPath, createStaticImagePath, createStaticArtistPath} = require('../utils/dirictories')
const {albumProxy} = require('../proxies/albumProxy')

const addAlbum = (req, res, next) => {
    const {albumId} = req.params;
    superagent.get('https://itunes.apple.com/lookup')
        .query({
            id: albumId,
            entity: 'album'
        })
        .end((error, response) => {
            if (error) {
                next(new RadioError('Album not found', 400, 'error'));
            } else {
                const {resultCount, results} = JSON.parse(response.text);
                if (!resultCount && !results) {
                    next(new RadioError('Album not found', 400, 'error'));
                }
                const album = results[resultCount - 1];
                const albumEntity = {
                    ARTIST_ID: album.artistId,
                    ID: album.collectionId,
                    ALBUM_NAME: album.collectionName,
                    COVER: album.artworkUrl100.replace('100x100', '3000x3000'),
                    COPYRIGHT: album.copyright,
                    RELEASE_DATE: new Date(album.releaseDate)
                }
                const path = `static/artists/${albumEntity.ARTIST_ID}/${albumEntity.ID}`;
                const artistPath = createStaticArtistPath(albumEntity.ARTIST_ID);
                const fullPath = createStaticPath(path);
                fs.access(fullPath, (error) => {
                    if (error) {
                        fs.mkdir(path, {recursive: true}, (error) => {
                            if (error) {
                                console.log('---> ERROR: fs.mkdir');
                                next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
                            } else {
                                const imagePath = createStaticImagePath(fullPath, albumEntity.ID);
                                download_image(albumEntity.COVER, imagePath).then(result => {
                                    albumEntity.COVER = imagePath;
                                    albumProxy.addAlbum(albumEntity).then(result => {
                                        res.send({
                                            id: albumEntity.ID,
                                            albumName: albumEntity.ALBUM_NAME,
                                            artistId: albumEntity.ARTIST_ID,
                                            cover: createAlbumCoverUrl(albumEntity.ID),
                                            copyright: albumEntity.COPYRIGHT,
                                            releaseDate: albumEntity.RELEASE_DATE
                                        });
                                    })
                                        .catch(error => {
                                            console.log('---> ERROR: albumProxy.addAlbum');
                                            rmdir(artistPath);
                                            next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
                                        })
                                })
                                    .catch(err => {
                                        console.log('---> ERROR: download_image');
                                        rmdir(artistPath);
                                        console.log(err);
                                        next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
                                    })
                            }
                        });
                    } else {
                        next(new RadioError('Album already exist', 400, 'error'));
                    }
                });
            }
        })

}
const removeAlbum = (req, res, next) => {
    const {albumId} = req.params;
}
const getAlbum = (req, res, next) => {
    const {albumId} = req.params;
    albumProxy.getAlbum(albumId).then(result => {
        const {rows, count} = result;
        if (!count) {
            next(new RadioError('Album not Found', 400, 'error'));
        } else {
            const albumEntity = {
                id: rows[0].ID,
                albumName:  rows[0].ALBUM_NAME,
                artistId:  rows[0].ARTIST_ID,
                cover: createAlbumCoverUrl( rows[0].ID),
                copyright:  rows[0].COPYRIGHT,
                releaseDate:  rows[0].RELEASE_DATE
            };
            res.send(albumEntity);
        }
    })
        .catch(error => {
            console.log(error);
            console.log('ERROR: albumProxy.getAlbum')
            next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
        })

}
const cover = (req, res, next) => {
    const id = parseInt(req.query.id);
    const size = parseInt(req.query.size);
    const attr = req.query.attr;
    albumProxy.getAlbum(parseInt(id)).then(result => {
        const {rows, count} = result;
        if (!count) {
            next(new RadioError('Cover not Found', 400, 'error'));
        } else {
            const albumEntity = rows[0];
            const roundedCornerResizer = imageFormatter(albumEntity.COVER, size, attr);
            res.set('Content-Type', 'image/png')
            //res.set('Content-Disposition', `attachment; filename="${albumEntity.ID}.png"`)
            res.set('Content-Disposition', `inline; filename="${albumEntity.ID}.png"`)
            roundedCornerResizer.pipe(res);
        }
    })
        .catch(error => {
            console.log(error);
            next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
        })

}
const search = (req, res, next) => {
    const {term} = req.query;
    let  searchResult = [];
    albumProxy.search(term)
        .then(async result =>{
            for (let album of  result.rows)
            {
                album = album.dataValues;
                const artistDto = {
                    id: album.ID,
                    albumName:  album.ALBUM_NAME,
                    artistId:  album.ARTIST_ID,
                    cover: createAlbumCoverUrl( album.ID),
                    copyright:  album.COPYRIGHT,
                    releaseDate:  album.RELEASE_DATE
                }
                searchResult.push(artistDto);
            }
            res.send(searchResult);
        }).catch(error=>{
        console.log(error);
        console.log('ERROR: albumProxy.search');
        next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
    })

}

const getAlbumSongs = (req, res, next) => {

}

module.exports = {
    addAlbum: addAlbum,
    removeAlbum: removeAlbum,
    getAlbum: getAlbum,
    cover: cover,
    getAlbumSongs: getAlbumSongs,
    search: search
};