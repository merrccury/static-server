const express = require("express");
const { addArtist, removeArtist } = require('../../controllers/artistController')

const artistRouter = express.Router();

artistRouter.post('/:artistId', addArtist)
artistRouter.delete('/:artistId', removeArtist)


module.exports = {artistRouter: artistRouter};