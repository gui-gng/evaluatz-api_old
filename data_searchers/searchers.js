const ebay_api = require("./searcher-ebay-api");
const google_images_api = require("./searcher_google-images-api")
const carsales = require("./searcher_carsale")
const gumtree = require("./searcher_gumtree")
const stocks_asx = require("./searcher_stocks_asx");


module.exports = {
    run: async (config) =>{
        console.log("Starting searchers")
        for(let i = 0;i < config.length;i++){
            let _config = config[i];
            let objConfig = {
                api_key: _config.api_key,
                delay_restart: _config.delay_restart,
                limit_req: _config.limit_req,
                delay_per_request:_config.delay_per_request
            };
            await eval(_config.source).setConfig(objConfig);
            eval(_config.source).start();
        }
    }
}
