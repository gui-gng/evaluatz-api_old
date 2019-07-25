require('../Utils');
const File = require('../DAO/file');

let api_key = "";
let limit_req = 0;
let delay_per_request = 0;
let delay_restart = 0.1;

let current_req = 0;
let process = null;
let startTime = null;

module.exports = {
  setConfig: async (config) => {
    api_key = config.api_key;
    delay_restart = config.delay_restart;
    limit_req = config.limit_req;
    delay_per_request = config.delay_per_request;
  },
  start:async () => {
    let delay_restart_ms = delay_restart * 60 * 60 * 1000;
    await restart();
    setInterval(async () => await restart(),  delay_restart_ms);
  }
}

async function restart(){
  startTime = new Date();
  console.log("================================================================\n" + 
              "============================STARTING============================\n" + 
              "======================"+ startTime.formatISO() + "===================\n"+
              "===========================Google API===========================\n" + 
              "================================================================");
  startTime = Date.now();
  process = setInterval(async () => await nextStep(), delay_per_request);
}

async function nextStep(){
  current_req++;
  let dt = new Date();
  console.log(dt.formatISO() + " - Google API executing step: " + current_req + "/" + limit_req);
  await searchEngine();
  if(current_req >= limit_req){
    current_req = 0;
    clearInterval(process)
  }
}



async function searchEngine(){

}


//const path = require('path')

/*
const file = new File();

const GoogleImages = require('google-images');

const client = new GoogleImages('000798668743927189953:tlm_d7qkqde', 'AIzaSyAXt7-S_qGf84z6Vl-gRdwEjIuxZlm5Xjg');
 
let listPath = [];
let categories = [];
const rootPath = "./raw_data/cars_google";
const pagesToSearch = 1;



async function listCarsLinks(){
    list = await file.getListFiles();
    console.log(list)
    categories = await file.getCategories();
    // console.log(categories);
    for(let i = 0;i < categories.length; i++){
        let listByCat = list[categories[i].PATH_TYPE];
        // console.log(listByCat)
        for(let l = 0;l < listByCat.length;l++){
            // console.log(listByCat[l]);
        }
    }
}




async function listCarsToFind(){
    listPath = await file.getList();

    for(let i = 0;i < listPath.length;i++){
        let path = listPath[i].PATH;
        let category = path.split("/")[0];

        let strSearch = path.replace(category+"/", "").replaceAll("/", " ");
        console.log("Category: " + category);
        console.log("Search: " + strSearch)
    }
    // console.log(list)
}
listCarsToFind();

function searchByPath(path){
    let carToFind =  path.replaceAll("/", " "); ///"Subaru Impreza MY09"

    for(pg = 1;pg <= pagesToSearch;pg++){
        client.search(carToFind, {page: pg})
        .then(images => {  
            images.forEach((img) => {
                if(img.type == "image/jpeg"){
                    let pathSave = rootPath + "/" +  path + "/" +  getRandomInt(100000000000) + ".jpg";
                    
                    // download(img.url, pathSave, function(){
                    //     console.log('Saved: ' + img.url);
                    // });
                }
            })
            
        });
    }
}


function download(uri, filename, callback){
    request.head(uri, function(err, res, body){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }


     //FORMAT Return GOOGLE IMAGES
            /**
             *  [
             * {
            "type": "image/jpeg",
            "width": 900,
            "height": 600,
            "size": 44424,
            "url": "https://carsales.pxcrush.net/carsales/cars/private/dtmplfc5ydjyyjpjn3culste2.jpg?pxc_method=crop&pxc_size=900%2C600",
            "thumbnail": {
                "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1tJhWumcDY3vYPept3yvbPmuM7I58IQSIkGCDg6q538iE-d6xPqp0eyGH",
                "width": 146,
                "height": 97
            },
            "description": "2008 Subaru Impreza WRX G3 Manual AWD MY09-SSE-AD-4481055 ...",
            "parentPage": "https://www.carsales.com.au/cars/details/subaru-impreza-2008/SSE-AD-4481055/"
            }]
    
             */