const {userProxy} = require("../proxies/userProxy");
const {AuthProxy} = require("../proxies/authProxy")
const {postman} = require("../utils/sendResponse")
const {JWT} = require('../utils/jwt')


const logIn = (req, res, next) => {
    const {email, password} = req.body;
    AuthProxy.checkLogin(email, password).then(async result => {
        result = result[0][0].ID;
        if (result === -1) {
            postman.sendError(res, 'Login or password entered incorrectly', 401);
        } else {
            const tokens = await JWT.createTokens(email)
            const user = await userProxy.getUser(email);
            tokens.roles = user.roles;
            postman.sendResponse(res, tokens);
        }
    }).catch(error => {
        postman.sendError(res, 'Login or password entered incorrectly', 401);
    })
}

const logOut = (req, res, next) => {
    res.end("Logout Contrllor");
}

const signUp = (req, res, next) => {
    const {firstName, lastName, email, password} = req.body;
    console.log(firstName, lastName, email, password);
    AuthProxy.register(firstName, lastName, email, password).then(async result => {
        const tokens = await JWT.createTokens(email)
        const user = await userProxy.getUser(email);
        tokens.roles = user.roles;
        postman.sendResponse(res, tokens);    }).catch(err => {
        postman.sendError(res, 'User with this email already exist');
    })
}

const restore = (req, res, next) => {
    res.end("Restore Contrllor");
}

module.exports = {logIn, logOut, signUp, restore};