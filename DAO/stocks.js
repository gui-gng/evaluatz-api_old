const db = require('./database');

pool = db.createPool();
 


module.exports =  {
    getStock:  async (symbol, startDate, endDate) => {
        return  await getStock(symbol, startDate, endDate);
    },
    search: async (symbol) => {
        return  await search(symbol);
    },
    insertHistoric: async (symbol, date, open, high, low, close, volume) => {
        return await insertHistoric(symbol, date, open, high, low, close, volume);
    },
    getAllStocks: async () => {
        return await getAllStocks();
    },
}


async function getAllStocks(){
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM public.stocks";
        let values = [];
        resolve(await execute(sqlQuery, values));
    });
}

async function search(symbol){
    return new Promise(async (resolve) => {
        console.log("Searching: " + symbol);
        let sqlQuery = "SELECT * FROM public.stocks WHERE company_name LIKE $1 OR symbol LIKE $1 LIMIT 10;";
        let values = ["%" + symbol + "%"];
        resolve(await execute(sqlQuery, values));
    });
}

async function getStock(symbol, startDate, endDate){
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT company_name, symbol, industry FROM public.stocks WHERE symbol = $1;";
        let values = [symbol];
        let response = await execute(sqlQuery, values);
        let stock = response[0];

        sqlQuery = "SELECT symbol, date, open, high, low, close, volume FROM public.stocks_historic";
        sqlQuery += " WHERE symbol = $1 AND date >= $2 AND date <= $3 ORDER BY date;";
        values = [symbol, startDate, endDate];
        stock['historic'] = await execute(sqlQuery, values);
        // console.log(stock);
        resolve(stock);
    });
}

async function insertHistoric(symbol, date, open, high, low, close, volume){
    return new Promise(async (resolve) => {
        let sqlQuery = "INSERT INTO public.stocks_historic(symbol, date, open, high, low, close, volume) VALUES ($1, $2, $3, $4, $5, $6, $7);";
        let values = [symbol, date, open, high, low, close, volume];
        resolve(await execute(sqlQuery, values));
    });
}



//=============================================================
//=========================AUXILIAR============================
//=============================================================
async function execute(sqlQuery, values){
    let rowsReturn = [];
    console.log("Inserting: " + values[0] + " - " + values[1])
    return new Promise(resolve => {
        pool.connect()
        .then(client => {
            return client.query(sqlQuery, values)
            .then(res => {
                rowsReturn = res.rows;
                client.release();
            })
            .catch(e => {
                client.release();
            })
            .then(() => resolve(rowsReturn));
        });
    });
}
