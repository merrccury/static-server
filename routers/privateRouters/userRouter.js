const express = require("express");
const {who, getUserSongs, addSong, deleteSong, favourites}  = require('../../controllers/userController')

const userRouter = express.Router();

userRouter.get('/who', who);
userRouter.get('/favourites', favourites);
userRouter.post('/song/:songId', addSong);
userRouter.delete('/song/:songId', deleteSong);

module.exports = {userRouter: userRouter};