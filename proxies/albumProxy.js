const {Sequelize, Albums} = require('../models');


const addAlbum = album => {
    return Albums.create(album);
}

const getAlbum = albumId => {
    return Albums.findAndCountAll({
        where: {
            ID: albumId
        },
        raw: true
    });
}

const search = term => Albums.findAndCountAll({
    where: {
        ALBUM_NAME: {
            [Sequelize.Op.like]: `%${term}%`
        }
    }
})

const albumProxy = {
    addAlbum: addAlbum,
    getAlbum: getAlbum,
    search: search
}

module.exports = {albumProxy};