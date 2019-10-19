var express = require('express');
var router = express.Router();

const auth = require("../middleware/auth");

const UserDAO = require('../DAO/user');
const TransactionDAO = require('../DAO/transaction');

router.get('/', auth, async function (req, res, next) {
    try {
        let user = await UserDAO.getUserByID(req.user.sub);
        const d = new Date(0);
        d.setUTCSeconds(req.user.exp);
        user["exp_sess"] = d;
        user["exp"] = req.user.exp;
        res.send(user);
    } catch (error) {
        res.send(error);
    }
});

router.get('/balance', auth, async function (req, res, next) {
    const balance = await TransactionDAO.getBalance(req.user.sub);
    res.send(balance);
});

router.get('/transactions', auth, async function (req, res, next) {
    const page_num = req.body.page_num || 1;
    const page_length = req.body.page_length || 100;
    const transactions = await User_transactions.getTransactions(req.user.sub, page_num, page_length);
    res.send(transactions);
});

module.exports = router;
