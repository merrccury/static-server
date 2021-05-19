const express = require('express');
const {songRouter} = require('./songRouter')
const {authRouter} = require('./authRouter')
const {albumRouter} = require('./albumRouter')
const {stationRouter} = require('./stationRouter')

const publicMapRouter = express.Router();


publicMapRouter.use('/auth', authRouter);
publicMapRouter.use('/song', songRouter);
publicMapRouter.use('/album', albumRouter);
publicMapRouter.use('/station', stationRouter);

module.exports = {publicMapRouter};