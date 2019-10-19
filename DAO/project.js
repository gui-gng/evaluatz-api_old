const db = require('./database');
let pool = db.createPool();


module.exports = {
    create: async (name, owner) => {
        return await create(name, owner);
    },
    remove: async (id) => {
        return await remove(id);
    },
    getByName: async (name) => {
        return await getByName(name);
    },
    geByID: async (id) => {
        return await geByID(id);
    },
    search: async (str,  page_num = 1, page_length = 100) => {
        return await search(str,  page_num, page_length);
    }

}


async function create(name, owner) {
    return new Promise(async (resolve) => {
        let sqlQuery = "INSERT INTO access.project(project_name, project_owner) " +
            "VALUES ($1, $2);";
        let values = [name, owner];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}

async function remove(id) {
    return new Promise(async (resolve) => {
        let sqlQuery = "DELETE FROM access.project WHERE project_id = $1";
        let values = [id];
        resolve(await db.execute(pool, sqlQuery, values));
    });
}


async function getByName(name) {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM access.get_project WHERE name = $1 LIMIT 1;";
        let values = [name];
        const project = await db.execute(pool, sqlQuery, values);
        try {
            resolve(project[0]);
        } catch (error) {
            resolve(error);
        }
    });
}

async function geByID(id) {
    return new Promise(async (resolve) => {
        let sqlQuery = "SELECT * FROM access.get_project WHERE id = $1 LIMIT 1;";
        let values = [id];
        const project = await db.execute(pool, sqlQuery, values);
        try {
            resolve(project[0]);
        } catch (error) {
            resolve(error);
        }
    });
}

async function search(str, page_num, page_length) {
    return new Promise(async (resolve) => {
        try {
            const limit = page_length;
            const offset = (page_num - 1) * page_length;
            let sqlQuery = "SELECT * FROM access.get_project WHERE name like $1 LIMIT $2 OFFSET $3;";
            let values = ["%" + str + "%",  limit, offset];
            const projects = await db.execute(pool, sqlQuery, values);
            resolve(projects);
        } catch (error) {
            resolve(error);
        }
    });
}
