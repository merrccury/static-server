const express = require("express");
const {addStation, getStations}  = require('../../controllers/stationController')

const stationRouter = express.Router();

stationRouter.post('/', addStation);
stationRouter.get('/', getStations);


module.exports = {stationRouter: stationRouter};