var express = require('express');
var router = express.Router();

const auth = require("../middleware/auth");

const ProjectDAO = require('../DAO/project');

router.get('/', auth, async function (req, res, next) {
    try {
        const page_num = req.body.page_num || 1;
        const page_length = req.body.page_length || 100;
        const project = req.body.project;
        let projects = await ProjectDAO.search(project, page_num, page_length);
        res.send(projects);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;
