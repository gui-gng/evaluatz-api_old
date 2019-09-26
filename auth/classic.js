const userDB = require("../DAO/users");
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = {
    auth: async (username, password) => auth(username, password),
    upsertUser: async (username, firstname, lastname, email, password) => await upsertUser(username, firstname, lastname, email, password)
}

async function upsertUser(username, firstname, lastname, email, password) {

    let response = { isSuccess: false, errors: [] };

    if (!password.trim()) {
        response.errors.push({ field: "password", msg: "Password is empty" });
    }

    if (!username.trim()) {
        response.errors.push({ field: "username", msg: "Username is empty" });
    }

    if (!firstname.trim()) {
        response.errors.push({ field: "firstname", msg: "Firstname is empty" });
    }

    if (!lastname.trim()) {
        response.errors.push({ field: "lastname", msg: "Lastname is empty" });
    }

    if (!email.trim()) {
        response.errors.push({ field: "email", msg: "Email is empty" });
    }

    if (response.errors.length > 0) {
        return response;
    }

    bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
        return {
            isSuccess: true,
            user: userDB.upsertUser(username, firstname, lastname, email, hash, 1)
        };
    });





}


async function auth(username, password) {
    let userAuth = userDB.getUserUsernameEmail(username);
    bcrypt.compare(password, userAuth.password, function (err, res) {
        // res == true
        if (res) {
            return userAuth;
        }
    });
}