var express = require('express');
var router = express.Router();

const StocksDAO = require('../DAO/stocks');

router.get('/:id', async function (req, res, next) {
    try {
        const end = new Date();
        const start = new Date(new Date().getTime() - ((end.getDay() % 6 + 6) * 24 * 60 * 60 * 1000));

        const startDate = req.body.startDate    || start.toISOString().split("T")[0];
        const finishDate = req.body.finishDate  || end.toISOString().split("T")[0];
        const stocks = await StocksDAO.getStock(req.params.id, startDate, finishDate);
        res.send(stocks);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;