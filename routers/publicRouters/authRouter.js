const express = require("express");
const { logIn, logOut, signUp, restore } = require('../../controllers/authController')

const   authRouter = express.Router();

authRouter.post('/login', logIn);
authRouter.post('/logout', logOut);
authRouter.post('/signup', signUp);
authRouter.post('/restore', restore);


module.exports = {authRouter};