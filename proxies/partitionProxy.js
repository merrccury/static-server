const {SongPartitions} = require('../models');

const addPartitions = (partitions) => {
    //console.log(partitions);
    return SongPartitions.bulkCreate(partitions);
}

const getPartitions = (albumId) => {
    return SongPartitions.findAll({
        where: {
            SONG_ID: parseInt(albumId)
        },
        order: [
            ['ID', 'ASC']
        ]
    })
}
const getPartition = (songId, sequence) => SongPartitions.findOne({
    where: {
        SONG_ID: songId,
        SEQUENCE: sequence
    }
});

const PartitionProxy = {
    addPartitions: addPartitions,
    getPartitions: getPartitions,
    getPartition:getPartition
}
module.exports = {
    PartitionProxy: PartitionProxy
}

