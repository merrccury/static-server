const express = require('express');
const {albumRouter} = require('./albumRouter')
const {artistRouter} = require('./artistRouter')
const {songRouter} = require('./songRouter')
const {userRouter} = require('./userRouter')
const {stationRouter} = require('./stationRouter')

const privateMapRouter = express.Router();


privateMapRouter.use('/album', albumRouter);
privateMapRouter.use('/artist', artistRouter);
privateMapRouter.use('/song', songRouter);
privateMapRouter.use('/user', userRouter);
privateMapRouter.use('/station', stationRouter);


module.exports = {privateMapRouter: privateMapRouter};