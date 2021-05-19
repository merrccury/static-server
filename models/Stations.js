const {User,} = require("./index");

module.exports = (Sequelize, sequelize) => {
    return sequelize.define("Stations", {
            ID: {type: Sequelize.INTEGER, primaryKey: true},
            CREATOR: {type: Sequelize.INTEGER, allowNull: false, references: {model: User, key: "ID"}},
            DATE_OF_CREATURE: {type: Sequelize.DATE, allowNull: false},
            DATE_OF_AVAILABILITY: {type: Sequelize.DATE, allowNull: false},
            TITLE: {type: Sequelize.STRING, allowNull: false},
            URL: {type: Sequelize.STRING, allowNull: false}
        }, {
            sequelize,
            modelName: 'Stations',
            tableName: 'STATIONS',
            timestamps: false
        }
    );
}