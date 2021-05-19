const postman = {
    sendError(res, message, status = 400) {
        res.send({

            type: "error",
            data: message,
            status: status
        })
    },
    sendResponse(res, message, status = 200) {
        res.send({

            type: "success",
            data: message,
            status: status
        })
    },
    sendUnauthorizedResponse(res, message, status = 200) {
        res.status(status).send({

            type: "Unauthorized",
            data: message,
            status: status
        })
    }
}

module.exports = {postman};