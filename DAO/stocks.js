const db = require('./database');
let pool = db.createPool();
const axios = require('axios');



module.exports = {
    getStock: async (source, symbol, startDate, endDate) => {
        switch (source) {
            case 'ASX':
                return await getStockASX(symbol, startDate, endDate);
            case 'NASDAQ':
                return await getStockNASDAQ(symbol, startDate, endDate);
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
    getAllStocks: async () => {
        return await getAllStocks();
    }
}


async function getAllStocks() {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.stocks";
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

async function getStockASX(symbol, startDate, endDate) {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT company_name, symbol, industry FROM public.stocks WHERE symbol = $1;";
        let values = [symbol];
        let response = await db.execute(pool, sqlQuery, values);
        let stock = response[0];

        sqlQuery = "SELECT symbol, date, open, high, low, close, volume FROM public.stocks_historic";
        sqlQuery += " WHERE symbol = $1 AND date >= $2 AND date <= $3 ORDER BY date;";
        values = [symbol, startDate, endDate];
        stock['historic'] = await db.execute(pool, sqlQuery, values);
        // console.log(stock);
        resolve(stock);
    });
}

async function insertHistoric(symbol, date, open, high, low, close, volume) {
    return new Promise(async (resolve) => {
        let sqlQuery = "INSERT INTO public.stocks_historic(symbol, date, open, high, low, close, volume) VALUES ($1, $2, $3, $4, $5, $6, $7);";
        let values = [symbol, date, open, high, low, close, volume];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}


async function getStockNASDAQ(symbol, startDate, endDate) {
    let sqlQuery = "SELECT company_name, symbol, industry FROM public.stocks WHERE symbol = $1;";
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