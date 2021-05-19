const {StylePagesArtist, sequelize} = require('../models');

const getPageStyle = id => {
    return StylePagesArtist.findAndCountAll({
        where: {
            ARTIST_ID: id
        },
        raw: true
    });
}

const pageStyleProxy = {
    getPageStyle: getPageStyle
}

module.exports = {
    pageStyleProxy:pageStyleProxy
}