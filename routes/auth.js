const express = require('express');
const router = express.Router();


//AUTH
const classic = require("../auth/classic");
const github = require("../auth/github");
const google = require("../auth/google");


/* GET home page. */
router.get('/classic', function (req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");
    if (!req.query.username || !req.query.password) {
        res.send({ isSuccess: false, errors: [{ field: "general", msg: "Bad Request" }] })
    } else {
        username = req.query.username;
        password = req.query.password;
        res.send(classic.auth(username, password));
    }
});

router.get('/github', function (req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");
    res.send();
});

router.get('/google', function (req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");
    if (req.query.code) {
        let userObj = google.getFromCode(req.query.code);
        console.log(userObj);
        res.send({ isSuccess: false, user: userObj });
    } else {
        res.send({ isSuccess: false, errors: [{ field: "general", msg: "Bad Request" }] });
    }
});

router.get('/getGoogleAuthLink', function(req, res, next) {
    res.set("Cached-Control","public, max-age=300, s-maxage-600");
    let link = {url: google.urlGoogle()};
    res.send(link);
  });
  


module.exports = router;
