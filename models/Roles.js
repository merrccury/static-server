
module.exports = (Sequelize, sequelize) => {
    return sequelize.define("Roles", {
            ID: {type: Sequelize.INTEGER, primaryKey: true,},
            ROLE: {type: Sequelize.STRING, allowNull: false},
        }, {
            sequelize,
            modelName: 'Roles',
            tableName: 'ROLES',
            timestamps: false
        }
    );
}