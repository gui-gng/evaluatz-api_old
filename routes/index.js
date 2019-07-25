var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.set("Cached-Control","public, max-age=300, s-maxage-600");
  res.send("Evaluatz api version: 1.0.0");
});


// router.get('/.well-known/acme-challenge/Gx4wF2JxmMCdWcnHWVlFtp29NihWv_C3a_DYmBLJyek', function(req, res, next) {
//   // res.sendFile(__dirname + '/check.txt');
//   res.json("Gx4wF2JxmMCdWcnHWVlFtp29NihWv_C3a_DYmBLJyek.BwH2qjkfaiWpwgw204U1AyNUfbcmYUSH_0b6VWRZqtI");
// });

module.exports = router;
