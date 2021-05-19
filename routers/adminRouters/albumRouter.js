const express = require("express");
const {addAlbum, removeAlbum} = require('../../controllers/albumController')

const albumRouter = express.Router();

albumRouter.post('/:albumId', addAlbum)
albumRouter.delete('/:albumId', removeAlbum)


module.exports = {albumRouter: albumRouter};