const {Stations} = require('../models');

const addStation = item => Stations.create(item);

const getStations = () => Stations.findAll({
    order: [
        ['DATE_OF_AVAILABILITY', 'ASC']
    ]
})

const deleteStation = (id) => Stations.destroy({
    where: {
        ID: id
    }
})

const StationProxy = {
    addStation: addStation,
    getStations: getStations,
    deleteStation: deleteStation
}

module.exports = {
    StationProxy: StationProxy
}
