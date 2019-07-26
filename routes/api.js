var express = require('express');
var router = express.Router();

const Stocks = require('../DAO/stocks');


/* STOCKS */
/**
 * symbol
 * startDate
 * endDate
 */
router.get('/stocks', async function (req, res, next) {
  var response = { Error: "Invalid Command" };
  //GET STOCK
  //?symbol=CBA&startDate=2019-01-01&endDate=2019-02-01
  if (req.query.symbol && req.query.startDate && req.query.endDate) {
    let symbol = req.query.symbol.toUpperCase();
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    response = await Stocks.getStock(symbol, startDate, endDate);
  }
  //SEARCH
  //?search=CBA
  if (req.query.search) {
    console.log(req.query.search);
    response = await Stocks.search(req.query.search.toUpperCase());
  }

  // ?getAllStocks
  if (req.query.getAllStocks) {
    response = await Stocks.getAllStocks();
  }
  res.send(response);
});



/* CARS */
router.get('/cars', function (req, res, next) {
  res.send(req.query);
});

module.exports = router;
