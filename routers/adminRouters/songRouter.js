const express = require("express");
const {addSong, deleteSong, parse} = require('../../controllers/songController')

const songRouter = express.Router();

songRouter.post('/:songId', addSong)
songRouter.get('/parse/:albumId', parse)
songRouter.delete('/:songId', deleteSong)

module.exports = {songRouter: songRouter};