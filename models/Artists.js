module.exports = (Sequelize, sequelize) => {
    return sequelize.define("Artists", {
            ID: {type: Sequelize.INTEGER, primaryKey: true},
            ARTIST_NAME: {type: Sequelize.STRING, allowNull: false},
            ARTIST_BIRTH: {type: Sequelize.DATE, allowNull: true},
            BIO: {type: Sequelize.STRING, allowNull: true}
        }, {
            sequelize,
            modelName: 'Artists',
            tableName: 'ARTISTS',
            timestamps: false
        }
    );
}