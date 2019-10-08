var express = require('express');
var router = express.Router();

const Users = require('../DAO/users');

router.get('/', async function (req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");
    let method = req.params.method;
    let value = req.params.value;
    switch (method) {
        case "1":
            res.send(getUserByUsername(value));
        default:
            res.send("Params not defined");
    }

});

function getUserByUsername(username) {
    return Users.getUserUsernameEmail(username);
}

module.exports = router;
