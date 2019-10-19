var express = require('express');
var router = express.Router();

const auth = require("../middleware/auth");

const ProjectDAO = require('../DAO/project');
const TransactionDAO = require('../DAO/transaction');


router.get('/create', auth, async function (req, res, next) {
    if (!req.query.name || !req.user.sub) {
        res.send({ isSuccess: false, errors: [{ section: "Create Project", msg: "Bad Request" }] });
    } else {
        try {
            let name = req.query.name;
            let owner = req.user.sub;
            const project = await ProjectDAO.create(name, owner);
            if (project.name == "error") {
                res.send({ isSuccess: false, code: project.code, error: project.detail })
            } else {
                res.send({ isSuccess: true, project })
            }
        } catch (error) {
            res.send({ isSuccess: false, errors: [{ section: "Create Project", msg: error }] });
        }
    }
});

router.post('/create', auth, async function (req, res, next) {
    if (!req.body.name || !req.user.sub) {
        res.send({ isSuccess: false, errors: [{ section: "Create Project", msg: "Bad Request" }] });
    } else {
        try {
            const name = req.body.name;
            const owner = req.user.sub;
            const project = await ProjectDAO.create(name, owner);
            if (project.name = "error") {
                res.send({ isSuccess: false, code: project.code, error: project.detail })
            } else {
                res.send({ isSuccess: true, project })
            }

        } catch (error) {
            res.send({ isSuccess: false, errors: [{ section: "Create Project", msg: error }] });
        }
    }
});



router.get('/:id', auth, async function (req, res, next) {
    try {
        let project = await ProjectDAO.geByID(req.params.id);
        res.send(project);
    } catch (error) {
        res.send(error);
    }
});

router.get(':id/balance', auth, async function (req, res, next) {
    const balance = await TransactionDAO.getBalance(req.params.id);
    res.send(balance);
});

router.get(':id/transactions', auth, async function (req, res, next) {
    const page_num = req.body.page_num || 1;
    const page_length = req.body.page_length || 100;
    const transactions = await TransactionDAO.getTransactions(req.params.id, page_num, page_length);
    res.send(transactions);
});



module.exports = router;
