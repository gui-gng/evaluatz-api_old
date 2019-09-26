const express = require('express');
const router = express.Router();


//AUTH
// const token = require("../auth/token");
const classic = require("../auth/classic");
const github = require("../auth/github");
const google = require("../auth/google");


/* GET home page. */
router.get('/classic', async function (req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");
    if (!req.query.username || !req.query.password) {
        res.send({ isSuccess: false, errors: [{ field: "general", msg: "Bad Request" }] })
    } else {
        let username = req.query.username;
        let password = req.query.password;
        classic.auth(username, password, function(userReturn){
            sOptions = {
                issuer: req.ip,
                subject: userReturn.email, 
                audience: userReturn.username // this should be provided by client
            }
            // res.send(token.sign({data:"test"}, sOptions));
            res.send("");
        });   
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
