const express = require("express");
const {m3u8} = require('../../controllers/stationController')

const stationRouter = express.Router();

stationRouter.get('/:playlist/:file', m3u8)

module.exports = {stationRouter: stationRouter};