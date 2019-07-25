// var firebase = require('firebase');
// var firebaseui = require('firebaseui');
var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.set("Cached-Control","public, max-age=300, s-maxage-600");
  res.render('index', { header:'partials/stocks/navbar', page: 'partials/stocks/index' });
});


module.exports = router;