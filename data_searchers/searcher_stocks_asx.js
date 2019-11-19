
const Fs = require('fs')  
const Path = require('path')  
const unzip = require('unzip');
const delay = require('delay');
const Axios = require("axios");
require('../Utils');

const stocks = require('../DAO/stocks');


//AUX FUNCTIONS
const getDirectories = source =>
    Fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
 
module.exports = {
    setConfig: async (config) => {
      api_key = config.api_key;
      delay_restart = config.delay_restart;
      limit_req = config.limit_req;
      delay_per_request = config.delay_per_request;
      
    },
    start: async () => {
      let delay_restart_ms = delay_restart * 60 * 60 * 1000;
      try{
        await getHistoricData();
      }catch(e){
        console.log("Error to update file");
      }
      
      setInterval(async () => await getHistoricData(), delay_restart_ms);
    }
  }



   async function getHistoricData() {
    var dateToday = new Date();
    var formatedDate = "week" + dateToday.formatISO().replaceAll("-","").split(" ")[0];
    if(dateToday.getDay() == 5){
        await downloadHistoricData(formatedDate);
        console.log("=======>Start Unzip")
        await unzipFile(formatedDate);
        await delay(1000);
        console.log("=======>Start update");
        await updateDatabase(formatedDate);
    }
    await updateOffline();
  }

  async function updateOffline(){
    let path = Path.resolve(__dirname, '../', 'storage', 'stocks_asx_historic');
    let dirStocks = getDirectories(path);
    dirStocks.forEach(async src => await updateDatabase(src));
  }

  async function downloadHistoricData(formatedDate){
        console.log("Downloading stock asx file: " + formatedDate);
        let url = 'https://www.asxhistoricaldata.com/data/' + formatedDate + ".zip";
        let path = Path.resolve(__dirname, '../', 'storage', 'stocks_asx_historic', formatedDate + '.zip');
        let writer = Fs.createWriteStream(path);

        let response = await Axios({
          url,
          method: 'GET',
          responseType: 'stream'
        });
      
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
          writer.on('finish', resolve)
          writer.on('error', reject)
        });
      
      
  }


  async function unzipFile(formatedDate){
    console.log("[1]");
    let path = Path.resolve(__dirname, '../', 'storage', 'stocks_asx_historic');
    let unzipStream = unzip.Extract({ path: path });
    Fs.createReadStream(path + '/' + formatedDate + '.zip').pipe(unzipStream);
    return new Promise((resolve, reject) => {
        unzipStream.on('finish', () => {
            console.log('Finish unzip.');
            resolve(1);
          })
        unzipStream.on('error', reject)
      });
  }

  async function updateDatabase(formatedDate){
     let path = Path.resolve(__dirname, '../', 'storage', 'stocks_asx_historic', formatedDate);
     let listFiles = Fs.readdirSync(path);
    
     for(let i = 0;i < listFiles.length;i++) {
         console.log( "Readfile: " + listFiles[i]);
         let file = Fs.readFileSync(path + '/' + listFiles[i], "utf-8");
         let fileSplit = file.split("\r\n");
         let values = [];

         for (let i = 0; i < fileSplit.length; i++) {
             let stock_csv_split = fileSplit[i].split(',');
             if (stock_csv_split.length == 7) {
                 values.push(
                   {
                     symbol: stock_csv_split[0], 
                     date: stock_csv_split[1].substr(0, 4) + "-" + stock_csv_split[1].substr(4, 2) + "-" + stock_csv_split[1].substr(6, 2), 
                     open: stock_csv_split[2], 
                     high: stock_csv_split[3], 
                     low: stock_csv_split[4], 
                     close: stock_csv_split[5], 
                     volume: stock_csv_split[6]
                    });
                
             }
         }
         await stocks.insertHistoricJSON(values);
         console.log(new Date() + " - Finished: " + listFiles[i] + " Inserted: " + values.length);

     }

   


  }



