var express = require('express');
var router = express.Router();

let gAuth = require("../auth/google");


/* GET home page. */
router.get('/', async function (req, res, next) {
  res.set("Cached-Control", "public, max-age=300, s-maxage-600");
  res.send("Evaluatz api version: " + global.package.version);
});
module.exports = router;
