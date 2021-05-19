const superagent = require('superagent');
const fs = require("fs");
const {createArtistCoverUrl, imageFormatter, rmdir, download_image} = require("../utils/file");
const {createStaticArtistImagePath, createStaticArtistPath} = require("../utils/dirictories");
const {RadioError} = require("../utils/RadioError");
const {artistProxy} = require("../proxies/artistProxy")
const {pageStyleProxy} = require("../proxies/pageStyleProxy")

const addArtist = (req, res, next) => {
    let {artistId} = req.params;
    artistId = parseInt(artistId);
    artistProxy.getArtist(artistId).then(result => {
        const {rows, count} = result;
        if (count) {
            next(new RadioError('Artist already exist', 400, 'error'));
        } else {
            superagent.get('https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewArtistSeeAll')
                .query({
                    ids: artistId,
                    country: 'us',
                    section: 0
                })
                .end((error, response) => {
                    if (error) {
                        console.log(error);
                        console.log('ERROR: superagent.get');
                        next(new RadioError('Something went wrong. Please try again later.', 400, 'error'))
                    } else {
                        const artistModel = response.body['storePlatformData']['webexp-product']['results'][artistId];
                        const artist = {
                            id: artistId,
                            artistName: artistModel.name,
                            artistBirth: artistModel.bornOrFormedDate ? new Date(artistModel.bornOrFormedDate) : new Date('May 17, 2021 03:54:00'),
                            artistBio: artistModel.artistBio ? artistModel.artistBio : ''
                        }
                        const artistModelStyle = artistModel.artwork;
                        const artistStyle = {
                            artistId: artistId,
                            bg_color: artistModelStyle.bgColor,
                            h_color: artistModelStyle.textColor2,
                            p_color: artistModelStyle.textColor3,
                            image: artistModelStyle.url.replace('{w}x{h}bb.{f}', '3000x3000bb.png')
                        }

                        fs.access(createStaticArtistPath(artist.id), (error) => {
                            if (error) {
                                fs.mkdir(createStaticArtistPath(artist.id), {recursive: true}, (error) => {
                                    if (error) {
                                        console.log(error);
                                        console.log('---> ERROR: fs.mkdir');
                                        rmdir(createStaticArtistPath(artist.id))
                                        next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
                                    } else {
                                        download_image(artistStyle.image, createStaticArtistImagePath(artist.id))
                                            .then(result => {
                                                artistStyle.image = createStaticArtistImagePath(artist.id);
                                                artistProxy.addArtist(artist, artistStyle).then(result => {
                                                    res.send({
                                                        artistStyle: artistStyle,
                                                        artist: artist
                                                    })
                                                })
                                                    .catch(error => {
                                                        console.log('ERROR: artistProxy.addArtist');
                                                        console.log(error);
                                                        rmdir(createStaticArtistPath(artist.id))
                                                        next(new RadioError('Something went wrong. Please try again later.', 400, 'error'))

                                                    })

                                            })
                                            .catch(error => {
                                                console.log('ERROR: download_image');
                                                console.log(error);
                                                rmdir(createStaticArtistPath(artist.id))
                                                next(new RadioError('Something went wrong. Please try again later.', 400, 'error'))
                                            });
                                    }
                                });
                            } else {
                                console.log('ERROR: fs.access - true')
                                next(new RadioError('Artist already exist', 400, 'error'))
                            }
                        });
                    }
                })
        }
    })
        .catch(err => {
            console.log('ERROR: artistProxy.getArtist');
            console.log(err);
            next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
        });
}

const removeArtist = (req, res, next) => {

}

const getArtist = async (req, res, next) => {
    let {artistId} = req.params;
    artistId = parseInt(artistId);
    let artist = await artistProxy.getArtist(artistId);
    let style = await artistProxy.getPageStyle(artistId);

    if (style.count !== 1 && artist.count !== 1) {
        next(new RadioError('Artist not found', 400, 'error'));
    } else {
        artist = artist.rows[0];
        style = style.rows[0];
        const artistDto = {
            id: artist.ID,
            name: artist.ARTIST_NAME,
            image: createArtistCoverUrl(artistId),
            birth: artist.ARTIST_BIRTH,
            bio: artist.BIO,
            bgColor: style.BG_COLOR,
            color1: style.H_COLOR,
            color2: style.P_COLOR
        }
        res.send(artistDto);
    }


}

const cover = (req, res, next) => {
    const id = parseInt(req.query.id);
    const size = parseInt(req.query.size);
    const attr = req.query.attr;
    artistProxy.getPageStyle(id).then(result => {
        const {rows, count} = result;
        if (!count) {
            next(new RadioError('Cover not Found', 400, 'error'));
        } else {
            const artistEntity = rows[0];
            const roundedCornerResizer = imageFormatter(artistEntity.IMAGE, size, attr);
            res.set('Content-Type', 'image/png')
            //res.set('Content-Disposition', `attachment; filename="${albumEntity.ID}.png"`)
            res.set('Content-Disposition', `inline; filename="${artistEntity.ARTIST_ID}.png"`)
            roundedCornerResizer.pipe(res);
        }
    })
        .catch(error => {
            console.log(error);
            next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
        })

}

const getArtistAlbums = (req, res, next) => {

}

const search = (req, res, next) => {
    const {term} = req.query;
    let searchResult = [];
    artistProxy.search(term)
        .then(async result => {
            for (let artist of result.rows) {
                let style = await artistProxy.getPageStyle(artist.dataValues.ID);
                style = style.rows[0];
                artist = artist.dataValues;
                const artistDto = {
                    id: artist.ID,
                    name: artist.ARTIST_NAME,
                    image: createArtistCoverUrl(artist.ID),
                    birth: artist.ARTIST_BIRTH,
                    bio: artist.BIO,
                    bgColor: style.BG_COLOR,
                    color1: style.H_COLOR,
                    color2: style.P_COLOR
                }
                searchResult.push(artistDto);
            }
            res.send(searchResult);
        }).catch(error => {
        console.log(error);
        console.log('ERROR: artistProxy.search');
        next(new RadioError('Something went wrong. Please try again later', 400, 'error'));
    })

}


module.exports = {
    addArtist: addArtist,
    removeArtist: removeArtist,
    getArtist: getArtist,
    cover: cover,
    getArtistAlbums: getArtistAlbums,
    search: search
}