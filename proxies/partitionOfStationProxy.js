const {PartitionsOfStations, sequelize} = require('../models')

const addPOS = (partitions) => PartitionsOfStations.bulkCreate(partitions);
const getAAC = (name, stationId) => sequelize
    .query(`SELECT SP.ACC
                FROM PARTITIONS_OF_STATIONS POS
                INNER JOIN SONG_PARTITIONS SP on POS.PARTICLE = SP.ID
                WHERE POS.STATION_ID = :id
                AND POS.PARTITION_NAME = :name;`,
        {
            replacements: {
                name: name,
                id: stationId
            }
        });

const deletePOF = (station) => PartitionsOfStations.destroy({
    where: {
        STATION_ID: station
    }
})

const PafProxy = {
    addPOS: addPOS,
    getAAC: getAAC,
    deletePOF: deletePOF
}


module.exports = {
    PafProxy: PafProxy
}