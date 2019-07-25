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
              "=========================== Carsales ===========================\n" + 
              "================================================================");
  startTime = Date.now();
  process = setInterval(async () => await nextStep(), delay_per_request);
}

async function nextStep(){
  current_req++;
  let dt = new Date();
  console.log(dt.formatISO() + " - Carsales api executing step: " + current_req + "/" + limit_req);
  await searchEngine();
  if(current_req >= limit_req){
    current_req = 0;
    clearInterval(process)
  }
}



async function searchEngine(){

}