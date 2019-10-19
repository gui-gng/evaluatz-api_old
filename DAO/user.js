const db = require('./database');
let pool = db.createPool();


module.exports = {
    upsertUser: async (username, firstname, lastname, email, password, auth_method_id) => {
        return await upsertUser(username, firstname, lastname, email, password, auth_method_id);
    },
    getUserLogin: async (value) => {
        return await getUserLogin(value);
    },
    getUserUsernameEmail: async (value) => {
        return await getUserUsernameEmail(value);
    },
    getUserByID: async (value) => {
        return await getUserByID(value);
    }
    
}


async function upsertUser(username, firstname, lastname, email, password, auth_method_id) {
    return new Promise(async (resolve) => {
        let sqlQuery = "INSERT INTO access.user (username, firstname, lastname, email, password, auth_method_id) "
            + " VALUES ($1,$2,$3,$4,$5,$6)  ON CONFLICT (email) DO UPDATE "
            + " SET username = $1, password = $5, firstname = $2, lastname = $3, auth_method_id = $6;";
        let values = [username, firstname, lastname, email, password, auth_method_id];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function getUserLogin(value) {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT userid, username, email, password FROM access.user WHERE username = $1 or email = $1 LIMIT 1;";
        let values = [value];
        const user = await db.execute(pool, sqlQuery, values);
        try {
            resolve(user[0]);
        } catch (error) {
            resolve(user);
        }
    });
}


async function getUserUsernameEmail(value) {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM access.get_user WHERE username = $1 or email = $1 LIMIT 1;";
        let values = [value];
        const user = await db.execute(pool, sqlQuery, values);
        try {
            resolve(user[0]);
        } catch (error) {
            resolve(user);
        }
    });
}

    async function getUserByID(value) {
        return new Promise(async (resolve) => {
            let sqlQuery = "SELECT * FROM access.get_user WHERE userid = $1 LIMIT 1;";
            let values = [value];
            const user = await db.execute(pool, sqlQuery, values);
            try {
                resolve(user[0]);
            } catch (error) {
                resolve(error);
            }
        });
}
