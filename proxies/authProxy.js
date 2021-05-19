const {sequelize} = require('../models');

const checkLogin = (email, password) => {
    return sequelize
        .query("SELECT CHECK_PASSWORD_AND_GET_ID (:email, :password) AS 'ID'",
            {
                replacements: {
                    email: email,
                    password: password
                }
            });
}
const register = (firstName, lastName, email, password) => {
    return sequelize
        .query('CALL REGISTER_USER (:firstName, :lastName, :email, :password)',
            {
                replacements: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                }
            });
}




const AuthProxy = {
    checkLogin: checkLogin,
    register: register
}

module.exports = {
    AuthProxy:AuthProxy
};