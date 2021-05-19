const {Artists} = require('./index');

module.exports = (Sequelize, sequelize) => {
    return sequelize.define("StylePagesTable", {
            ARTIST_ID: {type: Sequelize.INTEGER, primaryKey: true, references: {model: Artists, key: "ID"}},
            BG_COLOR: {type: Sequelize.STRING, allowNull: false},
            H_COLOR: {type: Sequelize.STRING, allowNull: false},
            P_COLOR: {type: Sequelize.STRING, allowNull: false},
            IMAGE: {type: Sequelize.STRING, allowNull: false},
        }, {
            sequelize,
            modelName: 'StylePagesTable',
            tableName: 'STYLE_PAGES_ARTIST',
            timestamps: false
        }
    );
}