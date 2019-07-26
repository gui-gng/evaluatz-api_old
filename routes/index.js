var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.set("Cached-Control","public, max-age=300, s-maxage-600");
  res.send("Evaluatz api version: 1.0.0");
});
module.exports = router;
