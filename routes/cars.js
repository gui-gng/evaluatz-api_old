var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.set("Cached-Control","public, max-age=300, s-maxage-600");
  res.render('index', { header:'partials/cars/navbar', page: 'partials/cars/how_it_works' });
});

module.exports = router;
