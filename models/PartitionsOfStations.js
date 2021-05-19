const {Songs, SongPartitions, Stations} = require('./index');

module.exports = (Sequelize, sequelize) => {
    return sequelize.define("PartitionsOfStations", {
            ID: {type: Sequelize.INTEGER, primaryKey: true},
            STATION_ID: {type: Sequelize.INTEGER, allowNull: false, references: {model: Stations, key: "ID"}},
            SONG_ID: {type: Sequelize.INTEGER, allowNull: false, references: {model: Songs, key: "ID"}},
            PARTICLE: {type: Sequelize.INTEGER, allowNull: false, references: {model: SongPartitions, key: "ID"}},
            PARTITION_NAME: {type: Sequelize.STRING, allowNull: false}
        }, {
            sequelize,
            modelName: 'PartitionsOfStations',
            tableName: 'PARTITIONS_OF_STATIONS',
            timestamps: false
        }
    );
}