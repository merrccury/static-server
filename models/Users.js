const {Roles, UsersRoles} = require('../index');


module.exports = (Sequelize, sequelize) => {
    return sequelize.define("Users", {
            ID: {type: Sequelize.INTEGER},
            FIRST_NAME: {type: Sequelize.STRING, allowNull: false},
            LAST_NAME: {type: Sequelize.STRING, allowNull: false},
            EMAIL: {type: Sequelize.STRING, allowNull: false, unique: true},
            PASSWORD: {type: Sequelize.STRING, allowNull: false},
            STATUS: {type: Sequelize.STRING, allowNull: false},
            ACCESS_TOKEN: {type: Sequelize.STRING, allowNull: true},
            REFRESH_TOKEN: {type: Sequelize.STRING, allowNull: true},

        }, {
            sequelize,
            modelName: 'Users',
            tableName: 'USERS',
            timestamps: false
        }
    );
}