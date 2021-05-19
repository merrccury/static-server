const express = require("express");
const {addAlbum, removeAlbum, getAlbum, cover, getAlbumSongs, search} = require('../../controllers/albumController')

const albumRouter = express.Router();

albumRouter.post('/:albumId', addAlbum)
albumRouter.get('/search', search)
albumRouter.get('/cover', cover)
albumRouter.get('/:albumId/songs', getAlbumSongs)
albumRouter.get('/:albumId', getAlbum)
albumRouter.delete('/:albumId', removeAlbum)


module.exports = {albumRouter: albumRouter};