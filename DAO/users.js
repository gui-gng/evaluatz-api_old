const db = require('./database');
let pool = db.createPool();
 

module.exports =  {
    upsertUser:  async (username, firstname, lastname, email, password, auth_method_id) => {
        return  await upsertUser(username, firstname, lastname, email, password, auth_method_id);
    },
    getUser: async (field, value) => {
        return  await getFirst(field, value);
    },
    getUserUsernameEmail: async (value) => {
        return await getUserUsernameEmail(value);
    }

}


async function upsertUser(username, firstname, lastname, email, password, auth_method_id){
    return new Promise(async (resolve) => {
        let sqlQuery = "INSERT INTO access.user (username, firstname, lastname, email, password, auth_method_id) " 
        + " VALUES ($1,$2,$3,$4,$5,$6)  ON CONFLICT (email) DO UPDATE "
        + " SET username = $1, password = $5, firstname = $2, lastname = $3;";
        let values = [username, firstname, lastname, email, password, auth_method_id];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function getFirst(field, value){
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM access.user WHERE $1 LIKE $2 LIMIT 1;";
        let values = [field, value];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}


async function getUserUsernameEmail(value){
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM access.user WHERE username = $1 or email = $1 LIMIT 1;";
        let values = [value];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}
