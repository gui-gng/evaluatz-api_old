var express = require('express');
var router = express.Router();

const auth = require("../middleware/auth");
const Token = require("../auth/token");
const Users = require('../DAO/users');

router.get('/', auth, async function (req, res, next) {
    let user = await getUserByUsername(req.user.sub);
    const d = new Date(0);
    d.setUTCSeconds(req.user.exp);
    user["exp_sess"] = d;
    user["exp"] = req.user.exp;
    res.send(user);
});

async function getUserByUsername(username) {
    let user = await Users.getUserUsernameEmail(username);
    delete user[0].password;
    return user[0];
}

module.exports = router;
