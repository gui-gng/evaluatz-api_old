var express = require('express');
var router = express.Router();

const auth = require("../middleware/auth");

const User = require('../DAO/user');
const User_transactions = require('../DAO/user_transactions');

router.get('/', auth, async function (req, res, next) {
    let user = await User.getUserByUsername(req.user.sub);
    const d = new Date(0);
    d.setUTCSeconds(req.user.exp);
    user["exp_sess"] = d;
    user["exp"] = req.user.exp;
    res.send(user);
});

router.get('/balance', auth, async function (req, res, next) {
    const balance = await User_transactions.getBalance(req.user.sub);
    res.send(balance);
});

router.get('/transactions', auth, async function (req, res, next) {
    const page_num = req.body.page_num || 1;
    const page_length = req.body.page_length || 100;
    const transactions = await User_transactions.getTransactions(req.user.sub, page_num, page_length);
    res.send(transactions);
});

module.exports = router;
