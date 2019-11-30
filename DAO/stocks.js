const db = require('./database');
let pool = db.createPool();
const axios = require('axios');



module.exports = {
    getStock: async (source, symbol, startDate, endDate, just_values) => {
        switch (source) {
            case 'ASX':
                return await getStockASX(symbol, startDate, endDate,just_values);
            case 'NASDAQ':
                return await getStockNASDAQ(symbol, startDate, endDate, just_values);
            default:
                return { Error: "Source unavailable" }
        }
    },
    
    search: async (symbol) => {
        return await search(symbol);
    },
    insertHistoric: async (symbol, date, open, high, low, close, volume) => {
        return await insertHistoric(symbol, date, open, high, low, close, volume);
    },
    insertHistoricJSON: async (json) => {
        return await insertHistoricJSON(json);
    },
    getAllStocks: async () => {
        return await getAllStocks();
    }
}


async function getAllStocks() {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.get_stocks_historic";
        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function search(symbol) {
    return new Promise(async (resolve) => {
        console.log("Searching: " + symbol);
        let sqlQuery = "SELECT * FROM public.stocks WHERE company_name LIKE $1 OR symbol LIKE $1 LIMIT 10;";
        let values = ["%" + symbol + "%"];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function insertHistoric(symbol, date, open, high, low, close, volume) {
    return new Promise(async (resolve) => {
        let sqlQuery = "INSERT INTO public.stocks_historic(symbol, date, open, high, low, close, volume) VALUES ($1, $2, $3, $4, $5, $6, $7);";
        let values = [symbol, date, open, high, low, close, volume];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}


async function insertHistoricJSON(json) {
    return new Promise(async (resolve) => {
        let sqlQuery = `with aux_json (doc) as (values ('${JSON.stringify(json)}'::json)) ` + 
        "INSERT INTO public.stocks_historic (symbol, date, open, high, low, close, volume) " +
        " select p.* from aux_json l cross join lateral json_populate_recordset(null::stocks_historic, doc) as p";
        let values = [];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function getStockASX(symbol, startDate, endDate, just_values) {
    return new Promise(async (resolve) => {
        if(just_values){
            let sqlQuery = "SELECT symbol, date, open, high, low, close, volume FROM public.stocks_historic";
            sqlQuery += " WHERE symbol = $1 AND date >= $2 AND date <= $3 ORDER BY date;";
            let values = [symbol, startDate, endDate];
            let hist = await db.execute(pool, sqlQuery, values);
            resolve(hist);
        }else{
            let sqlQuery = "SELECT * FROM public.stocks WHERE symbol = $1;";
            let values = [symbol];
            let response = await db.execute(pool, sqlQuery, values);
            let stock = response[0];
    
            sqlQuery = "SELECT symbol, date, open, high, low, close, volume FROM public.stocks_historic";
            sqlQuery += " WHERE symbol = $1 AND date >= $2 AND date <= $3 ORDER BY date;";
            values = [symbol, startDate, endDate];
            stock['historic'] = await db.execute(pool, sqlQuery, values);
            resolve(stock);
        }
     
    });
}




async function getStockNASDAQ(symbol, startDate, endDate, just_values) {
    return new Promise(async (resolve) => {
        if(just_values){
            const url = 'https://sandbox.tradier.com/v1/markets/history?' +
            "symbol=" + symbol + "&" +
            "interval=daily&" +
            "start=" + startDate + "&" +
            "end=" + endDate;

        const options = {
            url,
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer eOkJXLeAAMXUAxUprOd96TXdZsJP',
            }
        };

        axios(options).then(response => {
            resolve(response.data.history.day);
        })
            .catch(error => console.error(error));
        }else{
            let sqlQuery = "SELECT * FROM public.stocks WHERE symbol = $1;";
            let values = [symbol];
            let response = await db.execute(pool, sqlQuery, values);
            let stock = response[0];
    
            const url = 'https://sandbox.tradier.com/v1/markets/history?' +
                "symbol=" + symbol + "&" +
                "interval=daily&" +
                "start=" + startDate + "&" +
                "end=" + endDate;
    
            const options = {
                url,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer eOkJXLeAAMXUAxUprOd96TXdZsJP',
                }
            };
    
            axios(options).then(response => {
                stock['historic'] = response.data.history.day;
                resolve(stock);
            })
                .catch(error => console.error(error));
        }
       
    });
}