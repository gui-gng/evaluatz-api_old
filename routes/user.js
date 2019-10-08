var express = require('express');
var router = express.Router();

const Users = require('../DAO/users');

router.get('/:method/:value', async function (req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");
    let method = req.params.method;
    let value = req.params.value;
    // res.send(req.params);
    switch (method) {
        case "1":
            res.send(await getUserByUsername(value));
        default:
            res.send("Params not defined");
    }

});

async function getUserByUsername(username) {
    let user = await Users.getUserUsernameEmail(username);
    delete user[0].password;
    return user[0];
}

module.exports = router;
