const axios = require("axios");
require('../Utils');
const File = require('../DAO/file');
const file = new File();

const Product = require('../DAO/product');
const product = new Product();

let api_key = "";
let limit_req = 0;
let delay_per_request = 0;
let delay_restart = 0.1;

let num_pag = 3;
let entriesPerPage = 100;

let current_req = 0;
let process = null;
let startTime = null;
let listSearch = [];
let index_listSearch = 0;
let isRunning = false;


module.exports = {
  setConfig: async (config) => {
    api_key = config.api_key;
    delay_restart = config.delay_restart;
    limit_req = config.limit_req;
    delay_per_request = config.delay_per_request;
    await resetListSearch();
  },
  start: async () => {

    //RENEW KEY EVERY 2HRS
    await renewToken();
    setInterval(async () => await renewToken(), 7200000);

    let delay_restart_ms = delay_restart * 60 * 60 * 1000;
    await restart();
    setInterval(async () => await restart(), delay_restart_ms);
  }
}

async function restart() {

  startTime = new Date();
  console.log("================================================================\n" +
    "============================STARTING============================\n" +
    "======================" + startTime.formatISO() + "===================\n" +
    "============================EBAY API============================\n" +
    "================================================================");
  startTime = Date.now();
  process = setInterval(async () => await nextStep(), delay_per_request);
}

async function nextStep() {
  if (!isRunning) {
    
    let dt = new Date();
    console.log(dt.formatISO() + " - Ebay api executing step: " + current_req + "/" + limit_req);
    await searchEngine();
    if (current_req >= limit_req) {
      current_req = 0;
      clearInterval(process)
    }
  }
}



async function searchEngine() {
  isRunning = true;

  let ce_id = listSearch[index_listSearch].id;
  let ce_path = listSearch[index_listSearch].path;
  let ce_search_str = listSearch[index_listSearch].search_str;
  console.log("[" + index_listSearch + "]" + ce_id + " - " + ce_search_str);
  let current_page = 1;
  while (current_page <= num_pag) {
    let response = await executeRequest(await generateSearchUrl(ce_search_str, current_page));

    let items = response.itemSummaries;
    try {
      if (items) {
        console.log("[" + current_page + "] Results found: " + items.length);
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          
          let responsePage = await executeRequest(await generateGetItemUrl(item.itemId));
          console.log("============ITEM[" + i + "]=============");
          console.log("Title: " + responsePage.title);
          console.log("CategoryPATH: " + responsePage.categoryPath);
          console.log("ItemID: " + item.itemId + " categoryID: " + responsePage.categoryId);

          if (responsePage.categoryId == 35227) {
            let page_make = responsePage.localizedAspects.filter(la => la.name == "Manufacturer")[0].value;
            let page_model = responsePage.localizedAspects.filter(la => la.name == "Model")[0].value;
            let page_year = responsePage.localizedAspects.filter(la => la.name == "Year of Manufacture")[0].value;
            let price = responsePage.price.value;
            let currency = responsePage.price.currency;
            let page_path = "cars/" + page_make + "/" + page_model + "/" + page_year;

            let listImages = responsePage.additionalImages;
            for (let im = 0; im < listImages.length; im++) {
              let img = listImages[im].imageUrl;
              await file.insertFileByPath(page_path, false, img, "jpeg", "ebay-api");
            }
            await file.insertFileByPath(page_path, false, item.image.imageUrl, "jpeg", "ebay-api");

            let file_path_obj = await file.getPathByName(page_path);
            let product_path_id = file_path_obj[0].PATH_ID;
            await product.insert(price, product_path_id, "ebay-api", item.itemId, currency);
          }
        }
        if (entriesPerPage > items.length) {
          current_page = num_pag;
        } else {
          current_page++;
        }

      } else {
        current_page = num_pag;
      }

    } catch (e) {
      console.log(e);
    }
  }
  index_listSearch < listSearch.length - 1 ? index_listSearch++ : await resetListSearch();
  isRunning = false;
}

async function resetListSearch() {
  index_listSearch = 0;
  listSearch = await getListSearch();

  
}

async function getListSearch() {
  list = await file.getList();
  return list.map(item => {
    return {
      id: item.path_id,
      path: item.path,
      search_str: item.path.split("/").slice(1).join(" ")
    }
  });
}

async function executeRequest(url) {
  //   console.log(url);
  return new Promise(resolve => {
    axios.get(url,
      {
        headers:
        {
          // 'Content-Type': "application/x-www-form-urlencoded",
          "Authorization": "Bearer " + api_key
        }
      })
      .then(function (response) {
        current_req++;
        resolve(response.data);
      })
      .catch(function (error) {
        console.log(error.response['data']);
        resolve(0);
      });
  });
}







async function generateSearchUrl(search_str, current_page) {
  url = "https://api.ebay.com/buy/browse/v1/item_summary/search?";
  url += "category_ids=35227&";
  url += "q=" + encodeURI(search_str) + "&";
  url += "limit=" + entriesPerPage + "&";
  url += "offset=" + (entriesPerPage * current_page);
  return url;
}


async function generateGetItemUrl(itemID) {
  url = "https://api.ebay.com/buy/browse/v1/item/" + itemID;
  url += "?fieldgroups=PRODUCT";
  return url;
}


async function renewToken() {
  let credentialsBase64 = Buffer.from("Guilherm-Evaluatz-PRD-aeaa5c961-04821d30:PRD-eaa5c961d969-a640-41bd-baea-cff6").toString('base64');

  let urlRenewToken = "https://api.ebay.com/identity/v1/oauth2/token";
  return new Promise(resolve => {
  axios.post(urlRenewToken,{},
    {
      params: {
        "grant_type": 'client_credentials',
        "scope": "https://api.ebay.com/oauth/api_scope"
      },
      headers:
      {
        'Content-Type': "application/x-www-form-urlencoded",
        "Authorization": "Basic " + credentialsBase64
      }
    })
    .then(function (response) {
      console.log(response.data);
      // console.log(response.data.access_token);
      api_key = response.data.access_token
      resolve(response.data.access_token);
    })
    .catch(function (error) {
      console.log(error.response['data']);
      resolve(0);
    });
  });
}