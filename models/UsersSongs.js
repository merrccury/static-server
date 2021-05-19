const {Songs, Users} = require('./index');

module.exports = (Sequelize, sequelize) => {
    return sequelize.define("UsersSongs", {
            ID: {type: Sequelize.INTEGER},
            USER_ID: {type: Sequelize.INTEGER, allowNull: false, references: {model: Users, key: "ID"}},
            SONG_ID: {type: Sequelize.INTEGER, allowNull: false, references: {model: Songs, key: "ID"}}
        }, {
            sequelize,
            modelName: 'UsersSongs',
            tableName: 'USERS_SONGS',
            timestamps: false
        }
    );
}