const {Sequelize, QueryTypes} = require("sequelize");
const sequelize = new Sequelize("radio_plus", "root", "root", {
    dialect: "mysql",
    host: "localhost"
});

const UsersRoles = require("./UsersRoles")(Sequelize, sequelize);
const Roles = require("./Roles")(Sequelize, sequelize);
const Users = require("./Users")(Sequelize, sequelize);
const Artists = require("./Artists")(Sequelize, sequelize);
const StylePagesArtist = require("./StylePagesArtist")(Sequelize, sequelize);
const Albums = require("./Albums")(Sequelize, sequelize);
const Songs = require("./Songs")(Sequelize, sequelize);
const SongPartitions = require("./SongPartitions")(Sequelize, sequelize);
const UsersSongs = require("./UsersSongs")(Sequelize, sequelize);
const Stations = require("./Stations")(Sequelize, sequelize);
const PartitionsOfStations = require("./PartitionsOfStations")(Sequelize, sequelize);

Users.belongsToMany(Roles, {through: UsersRoles, foreignKey: "USER_ID"});
Roles.belongsToMany(Users, {through: UsersRoles, foreignKey: "ROLE_ID"});

Users.belongsToMany(Songs, {through: UsersSongs, foreignKey: "USER_ID"});
Songs.belongsToMany(Users, {through: UsersSongs, foreignKey: "SONG_ID"});

Artists.hasMany(Songs);
//Artists.hasOne(StylePagesArtist);
//StylePagesArtist.belongsTo(Artists);

// Songs.hasOne(Albums);
// Songs.hasOne(Artists);

//Users.hasMany(Roles);

module.exports = {
    Artists,
    Albums,
    StylePagesArtist,
    UsersRoles,
    Roles,
    Users,
    sequelize,
    Sequelize,
    Songs,
    SongPartitions,
    QueryTypes,
    UsersSongs,
    Stations,
    PartitionsOfStations
};
