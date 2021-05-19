const {Songs} = require("./index");

module.exports = (Sequelize, sequelize) => {
    return sequelize.define("SongPartitions", {
            ID: {type: Sequelize.INTEGER, primaryKey: true},
            ACC: {type: Sequelize.STRING, allowNull: false},
            SEQUENCE: {type: Sequelize.INTEGER, allowNull: false},
            DURATION: {type: Sequelize.INTEGER, allowNull: false},
            SONG_ID: {type: Sequelize.INTEGER, allowNull: false, references: {model: Songs, key: "ID"}}
        }, {
            sequelize,
            modelName: 'SongPartitions',
            tableName: 'SONG_PARTITIONS',
            timestamps: false
        }
    );
}