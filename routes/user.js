var express = require('express');
var router = express.Router();

const Token = require("../auth/token");
const Users = require('../DAO/users');

router.get('/:token', async function (req, res, next) {
    let token = req.query.token;
    var payload = Token.decode(token).payload.sub;
    
    sOptions = {
        issuer: req.ip,
        subject: payload.sub,
        audience: payload.aud
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
