var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.set("Cached-Control","public, max-age=300, s-maxage-600");
  res.render('index', { header:'partials/stocks/navbar', page: 'partials/stocks/index' });
});

router.get('/how-it-works', function(req, res, next) {
    res.set("Cached-Control","public, max-age=300, s-maxage-600");
    res.render('index', { header:'partials/stocks/navbar', page: 'partials/stocks/how_it_works' });
});

router.get('/:symbol', function(req, res, next) {
    res.set("Cached-Control","public, max-age=300, s-maxage-600");
    res.render('index', { 
        header:'partials/stocks/navbar', 
        page: 'partials/stocks/display_stock', 
        symbol: req.params.symbol,
        startDateDefault: (new Date()).getFullYear() + "-01-01",
        endDateDefault: getToday()
    });
});
  

module.exports = router;


function getToday() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}