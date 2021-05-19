const {Roles, Users} = require('./index');

module.exports = (Sequelize, sequelize) => {
    return sequelize.define("UsersRoles", {
            ID: {type: Sequelize.INTEGER, primaryKey: true},
            USER_ID: {type: Sequelize.INTEGER, allowNull: false, references: {model: Users, key: "ID"}},
            ROLE_ID: {type: Sequelize.INTEGER, allowNull: false, references: {model: Roles, key: "ID"}}
        }, {
            sequelize,
            modelName: 'UsersRoles',
            tableName: 'USERS_ROLES',
            timestamps: false
        }
    );
}