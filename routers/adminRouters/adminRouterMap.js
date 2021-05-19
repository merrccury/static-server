const express = require('express');
const {albumRouter} = require('./albumRouter')
const {artistRouter} = require('./artistRouter')
const {songRouter} = require('./songRouter')


const adminMapRouter = express.Router();


adminMapRouter.use('/album', albumRouter);
adminMapRouter.use('/artist', artistRouter);
adminMapRouter.use('/song', songRouter);


module.exports = {adminMapRouter};