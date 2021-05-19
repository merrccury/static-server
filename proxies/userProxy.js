const {Users, Roles, Songs} = require('../models');

const getUser = async email => {
    const result = await Users.findAll({
        where: {
            EMAIL: email
        },
        include: Roles,
        raw: true
    });

    const user = {
        id: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        roles: []
    }
    result.forEach(item => {
        user.id = item.ID;
        user.firstName = item.FIRST_NAME;
        user.lastName = item.LAST_NAME;
        user.email = item.EMAIL;
        user.roles.push(item['Roles.ROLE']);
    })

    return user;
}

const getUserSongs = async id => {
    const result = await Users.findAll({
        where: {
            ID: id
        },
        include: Songs,
        raw: true
    });
    const user = {
        id: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        songs: []
    }

    result.forEach(item => {
        user.id = item.ID;
        user.firstName = item.FIRST_NAME;
        user.lastName = item.LAST_NAME;
        user.email = item.EMAIL;
        user.songs.push(item['Roles.ROLE']);
    })
    return user;
}

const addSongToUser = async (id) => {

}

const userProxy = {
    getUser: getUser,
    getUserSongs: getUserSongs,
    addSongToUser: addSongToUser
}

module.exports = {
    userProxy: userProxy
}
