var express = require('express');
var router = express.Router();

const auth = require("../middleware/auth");

const ProjectDAO = require('../DAO/project');

router.get('/', auth, async function (req, res, next) {
    try {
        const page_num = req.query.page_num || 1;
        const page_length = req.query.page_length || 100;
        const project = req.query.project.toUpperCase();
        let projects = await ProjectDAO.search(project, page_num, page_length);
        res.send(projects);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;
