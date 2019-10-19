const db = require('./database');
let pool = db.createPool();
 

module.exports =  {
    execute:  async (sender, receiver, value) => {
        return  await execute(sender, receiver, value);
    },
    getTransactions: async (id, page_num = 1, page_length = 100) => {
        return  await getTransactions(id, page_num, page_length);
    },
    getBalance: async (id) => {
        return  await getBalance(id);
    }
}


async function execute(sender, receiver, value){
    return new Promise(async (resolve) => {
        let sqlQuery = "INSERT INTO access.transaction(transaction_sender, transaction_receiver, transaction_value)"
        + " VALUES ($1, $2, $3);"; 
        let values = [sender, receiver, value];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function getTransactions(id, page_num, page_length){
    return new Promise(async (resolve) => {
        const limit = page_length;
        const offset = (page_num - 1) * page_length;
        let sqlQuery = "SELECT * FROM access.transaction_cross WHERE transaction_user = $1 LIMIT $2 OFFSET $3;";
        let values = [id, limit, offset];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function getBalance(id){
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM access.balance WHERE balance_user = $1;";
        let values = [id];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}
