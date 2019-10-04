const express = require('express');
const router = express.Router();


//AUTH
const token = require("../auth/token");
const classic = require("../auth/classic");
const github = require("../auth/github");
const google = require("../auth/google");

router.get('/', function(req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");
    sOptions = {
        issuer: req.ip,
        subject: req.query.email,
        audience: req.query.email
    }
    res.send(token.verify(req.query.code, sOptions));
});

/* GET home page. */
router.get('/classic', async function(req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");
    
    if (!req.query.username || !req.query.password) {
        res.send({ isSuccess: false, errors: [{ field: "general", msg: "Bad Request" }] })
    } else {
        let username = req.query.username;
        let password = req.query.password;
        classic.auth(username, password, function(authRes) {
            if(authRes.isSuccess){
                sOptions = {
                    issuer: req.ip,
                    subject: authRes.user.email,
                    audience: authRes.user.email
                }
                res.send({user:authRes.user, token: token.sign({ data: "test" }, sOptions)});
            }else{
                res.send(authRes.errors);
            }
           
        });
    }
});

router.get('/github', function(req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");
    res.send();
});


router.get('/google', async function(req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");
    if (req.query.code) {
        let userObj = await google.getFromCode(req.query.code);
        // console.log(userObj);

        let username = userObj.email;
        let firstname = userObj.name.givenName;
        let lastname = userObj.name.familyName;
        let email = userObj.email;
        let password = userObj.tokens.access_token;

        google.upsertUser(username, firstname, lastname, email, password, function(user) {
            res.send(user);
        });
    } else {
        res.send({ isSuccess: false, errors: [{ field: "general", msg: "Bad Request" }] });
    }
});

router.get('/getGoogleAuthLink', function(req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");
    let link = { url: google.urlGoogle() };
    res.redirect(link.url);
    //res.send(link);
});



module.exports = router;