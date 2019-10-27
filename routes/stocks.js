var express = require('express');
var router = express.Router();

const StocksDAO = require('../DAO/stocks');

router.get('/:source/:symbol', async function (req, res, next) {
    try {
        const end = new Date();
        const start = new Date(new Date().getTime() - ((end.getDay() % 6 + 6) * 24 * 60 * 60 * 1000));
        const startDate = req.query.startDate    || start.toISOString().split("T")[0];
        const finishDate = req.query.finishDate  || end.toISOString().split("T")[0];
        const stocks = await StocksDAO.getStock(req.params.source, req.params.symbol, startDate, finishDate);
        res.send(stocks);
    } catch (error) {
        res.send(error);
    }
});


router.get('/list', async function (req, res, next) {
    try {
        const stocks = await StocksDAO.getAllStocks();
        res.send(stocks);
    } catch (error) {
        res.send(error);
    }
});


router.get('/search/:symbol', async function (req, res, next) {
    try {
        const stocks = await StocksDAO.search(req.params.symbol);
        res.send(stocks);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;