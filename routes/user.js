var express = require('express');
var router = express.Router();

const Token = require("../auth/token");
const Users = require('../DAO/users');

router.get('/:username', async function (req, res, next) {
    let token = req.cookies.token;
    
    sOptions = {
        issuer: req.ip,
        subject: req.query.username,
        audience: req.query.username
    }
    let isValid = Token.verify(token, sOptions);
    console.log(isValid)
    res.send(isValid ? await getUserByUsername(value) : {Error: "Invalid Token"});
});

async function getUserByUsername(username) {
    let user = await Users.getUserUsernameEmail(username);
    delete user[0].password;
    return user[0];
}

module.exports = router;
