const express = require("express");
const {
    getArtist, cover,
    getArtistAlbums, search
} = require('../../controllers/artistController')

const artistRouter = express.Router();

artistRouter.get('/search', search)
artistRouter.get('/cover', cover)
artistRouter.get('/:artistId/albums', getArtistAlbums)
artistRouter.get('/:artistId', getArtist)


module.exports = {artistRouter: artistRouter};