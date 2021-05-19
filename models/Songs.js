const {Albums, Artists} = require("./index");

module.exports = (Sequelize, sequelize) => {
    return sequelize.define("Songs", {
            ID: {type: Sequelize.INTEGER, primaryKey: true},
            ALBUM_ID: {type: Sequelize.INTEGER, allowNull: false, references: {model: Albums, key: "ID"}},
            ARTIST_ID: {type: Sequelize.INTEGER, allowNull: false, references: {model: Artists, key: "ID"}},
            M3U8: {type: Sequelize.STRING, allowNull: false},
            SONG_NAME: {type: Sequelize.STRING, allowNull: false},
            APPLE_MUSIC_URL: {type: Sequelize.STRING, allowNull: false}
        }, {
            sequelize,
            modelName: 'Songs',
            tableName: 'SONGS',
            timestamps: false
        }
    );
}