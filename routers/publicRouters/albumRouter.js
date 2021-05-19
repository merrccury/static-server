const express = require("express");
const {cover} = require('../../controllers/albumController')

const albumRouter = express.Router();

albumRouter.get('/cover', cover)

module.exports = {albumRouter: albumRouter};