const {Artists, StylePagesArtist, sequelize, Sequelize} = require('../models');

const getArtist = (artistId) => {
    return Artists.findAndCountAll({
        where: {
            ID: artistId
        },
        raw: true
    });
}

const addArtist = (artist, pageStyle) => {
    return sequelize
        .query('CALL ADD_ARTIST (:id, :artistName, :artistBirth, :artistBio, ' +
            ':bgColor, :hColor, :pColor, :image)',
            {
                replacements: {
                    id: parseInt(artist.id),
                    artistName: artist.artistName,
                    artistBirth: artist.artistBirth,
                    artistBio: artist.artistBio,
                    bgColor: pageStyle.bg_color,
                    hColor: pageStyle.h_color,
                    pColor: pageStyle.p_color,
                    image: pageStyle.image
                }
            });
}

const getPageStyle = id => {
    return StylePagesArtist.findAndCountAll({
        where: {
            ARTIST_ID: id
        },
        raw: true
    });
}
const search = term => Artists.findAndCountAll({
    where: {
        ARTIST_NAME: {
            [Sequelize.Op.like]: `%${term}%`
        }
    }
})



const artistProxy = {
    getArtist: getArtist,
    addArtist: addArtist,
    getPageStyle: getPageStyle,
    search:search
}

module.exports = {artistProxy}
