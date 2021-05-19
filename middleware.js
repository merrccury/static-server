const {JWT} = require('./utils/jwt')
const {postman} = require('./utils/sendResponse')
const errorHandler = (err, req, res, next) => {
    res.status(err.status).send({
        type: err.type,
        status: err.status,
        message: err.message
    });
};

const authHandler = (req, res, next) => {
    const access = req.header('Access-Token');
    const refresh = req.header('Refresh-Token');
    console.log(access);
    console.log(refresh);
    if(access && refresh){
        const verification = JWT.verify(access, refresh);
        if (verification){
            req.params.email = verification.access.email;
            req.params.id = verification.access.id;
            next()
        }
        else{
            postman.sendUnauthorizedResponse(res, 'Unauthorized', 401);
        }
    }
    else{
        postman.sendUnauthorizedResponse(res, 'Unauthorized', 401);
    }
}

const adminHandler = (req, res, next) =>{
    const access = req.header('Access-Token');
    const refresh = req.header('Refresh-Token');
    if(access && refresh){
        const verification = JWT.verify(access, refresh);
        if (verification){
            next()
        }
        else{
            postman.sendUnauthorizedResponse(res, 'Unauthorized', 401);
        }
    }
    else{
        postman.sendUnauthorizedResponse(res, 'Unauthorized', 401);
    }
}


module.exports = {
    errorHandler: errorHandler,
    authHandler: authHandler,
    adminHandler:adminHandler
}