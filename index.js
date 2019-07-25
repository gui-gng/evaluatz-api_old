global.evaluatz_is_dev = false

const functions = require('firebase-functions');
const app = require('./app');
const fs = require("fs");
const searchers = require("./data_searchers/searchers")

//Start Searchers 
const config_limit_request = JSON.parse(fs.readFileSync(__dirname +  "/config/config_limit_request.json")).filter(c => c.active);
searchers.run(config_limit_request);

 
exports.app = functions.https.onRequest(app);
