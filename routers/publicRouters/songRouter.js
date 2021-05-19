const express = require("express");
const {m3u8} = require('../../controllers/songController')

const songRouter = express.Router();

songRouter.get('/m3u8/:artistId/:albumId/:songId/:file', m3u8)

module.exports = {songRouter: songRouter};