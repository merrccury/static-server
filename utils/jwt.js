const jwt = require('jsonwebtoken');
const {userProxy} = require('../proxies/userProxy')
const crypto = require("crypto");

const key = 'SuperSuperPassword'

const createTokens = async email => {
    const user = await userProxy.getUser(email);
    console.log(user);
    user.iat = Math.floor(Date.now() / 1000) + 300;
    //const accessToken = jwt.sign({...user,  iat: Math.floor(Date.now() / 1000) - 30 }, key, { algorithm: 'RS256'})
    const accessToken = jwt.sign(user, key);
    const refreshToken = jwt.sign({
        iat: Math.floor(Date.now() / 1000) + 3600 * 24 * 7,
        key: crypto.randomBytes(36).toString('hex')
    }, key);

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

const verify = (access, refresh) => {
    try {
        return {
            access: jwt.verify(access, key),
            refresh: jwt.verify(refresh, key)
        };
    } catch (e) {
        return undefined;
    }
}

const verifyAccess = (access) => {
    try {
        return jwt.verify(access, key);
    } catch (e) {
        return undefined;
    }
}


const JWT = {
    createTokens: createTokens,
    verify: verify,
    verifyAccess: verifyAccess
}

module.exports = {
    JWT: JWT
}