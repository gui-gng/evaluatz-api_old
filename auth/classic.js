const userDB = require("../DAO/users");
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = {
    auth: async (username, password, callback) =>  await auth(username, password, callback),
    upsertUser: async (username, firstname, lastname, email, password, callback) => await upsertUser(username, firstname, lastname, email, password, callback)
}

async function upsertUser(username, firstname, lastname, email, password, callback) {

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

    bcrypt.hash(password, saltRounds, async function (err, hash) {
        await userDB.upsertUser(username, firstname, lastname, email, hash, 1);
        let userAuth = (await userDB.getUserUsernameEmail(username));
        callback({
            isSuccess: true,
            user: userAuth
        });
    });
}


async function auth(username, password, callback) {
    if(!username || !password){
        return { isSuccess: false, errors: [{ field: "Login", msg: "Empty fields" }] }
    }
    let userAuth = (await userDB.getUserUsernameEmail(username))[0];
    
    if(!userAuth || !userAuth.password){
        return { isSuccess: false, errors: [{ field: "Login", msg: "Invalid email or password" }] }
    }

    bcrypt.compare(password, userAuth.password, function (err, res) {
        if (res) {
            callback(userAuth);
        }
        else
        {
            callback({isSuccess: false, errors: [{ field: "Login", msg: "Invalid email or password" }]});
        }
    });
}