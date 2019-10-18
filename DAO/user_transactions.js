const db = require('./database');
let pool = db.createPool();
 

module.exports =  {
    send:  async (userid, value) => {
        return  await send(userid, value);
    },
    getTransactions: async (userid, page_num = 1, page_length = 100) => {
        return  await getTransactions(userid, page_num, page_length);
    },
    getBalance: async (userid) => {
        return  await getBalance(userid);
    }
}


async function send(userid, value){
    return new Promise(async (resolve) => {
        let sqlQuery = "INSERT INTO access.user_transaction(user_transaction_user_id, user_transaction_value, user_transaction_timestamp)"
        + " VALUES ($1, $2, current_timestamp);"; 
        let values = [userid, value];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function getTransactions(userid, page_num, page_length){
    return new Promise(async (resolve) => {
        const limit = page_length;
        const offset = (page_num - 1) * page_length;
        let sqlQuery = "SELECT * FROM access.user_transaction WHERE userid = $1 LIMIT $2 OFFSET $3;";
        let values = [userid, limit, offset];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}


async function getBalance(userid){
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM access.user_balance WHERE userid = $1;";
        let values = [userid];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}
