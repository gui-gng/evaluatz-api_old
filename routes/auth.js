const express = require('express');
const router = express.Router();


//AUTH
const token = require("../auth/token");
const classic = require("../auth/classic");
const github = require("../auth/github");
const google = require("../auth/google");

router.get('/', function (req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");
    sOptions = {
        issuer: req.ip,
        subject: req.query.email,
        audience: req.query.email
    }
    res.send(token.verify(req.query.code, sOptions));
});

/* GET home page. */
router.get('/classic', async function (req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");

    if (!req.query.username || !req.query.password) {
        res.send({ isSuccess: false, errors: [{ field: "general", msg: "Bad Request" }] })
    } else {
        let username = req.query.username;
        let password = req.query.password;
        classic.auth(username, password, function (authRes) {
            if (authRes.isSuccess) {
                sOptions = {
                    issuer: req.ip,
                    subject: authRes.user.email,
                    audience: authRes.user.email
                }
                let tokenRes = token.sign({ authType: "Classic" }, sOptions);
                res.send(tokenRes);
            } else {
                res.send(authRes.errors);
            }
        });
    }
});

router.get('/github', function (req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");
    res.send();
});


router.get('/google', async function (req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");
    if (req.query.code) {
        let userObj = await google.getFromCode(req.query.code);
        let username = "2_" + userObj.id;
        let firstname = userObj.name.givenName;
        let lastname = userObj.name.familyName;
        let email = userObj.email;
        let password = req.query.code;
        // let password = userObj.tokens.access_token;

        google.upsertUser(username, firstname, lastname, email, password, function (user) {
            let sbj = user.email ? user.email : "Nothing";
            sOptions = {
                issuer: req.ip,
                subject: sbj,
                audience: sbj
            }
            let tokenRes = token.sign({ authType: "Google" }, sOptions);

            res.redirect("http://localhost:3000/Auth/" + tokenRes);
        });
    } else {
        res.send({ isSuccess: false, errors: [{ field: "general", msg: "Bad Request" }] });
    }
});

router.get('/getGoogleAuthLink', function (req, res, next) {
    res.set("Cached-Control", "public, max-age=300, s-maxage-600");
    let link = { url: google.urlGoogle() };
    res.redirect(link.url);
});



module.exports = router;