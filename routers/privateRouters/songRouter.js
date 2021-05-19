const express = require("express");
const {getSong, m3u8, search, checkSong} = require('../../controllers/songController')

const songRouter = express.Router();

songRouter.get('/search', search)
songRouter.get('/:songId', getSong)
songRouter.get('/check/:songId', checkSong)
songRouter.get('/m3u8/:artistId/:albumId/:songId/:file', m3u8)

module.exports = {songRouter: songRouter};