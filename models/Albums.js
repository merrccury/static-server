const {Artists} = require('./index');

module.exports = (Sequelize, sequelize) => {
    return sequelize.define("Albums", {
            ARTIST_ID: {type: Sequelize.INTEGER, references: {model: Artists, key: "ID"}},
            ID: {type: Sequelize.INTEGER, primaryKey: true},
            ALBUM_NAME: {type: Sequelize.STRING, allowNull: false},
            COVER: {type: Sequelize.STRING, allowNull: false},
            COPYRIGHT: {type: Sequelize.STRING, allowNull: false},
            RELEASE_DATE: {type: Sequelize.DATE, allowNull: false},
        }, {
            sequelize,
            modelName: 'Albums',
            tableName: 'ALBUMS',
            timestamps: false
        }
    );
}