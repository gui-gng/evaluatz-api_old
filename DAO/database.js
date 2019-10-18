const { Pool } = require('pg')


console.log("Connecting database: " + (global.evaluatz_is_dev ? "DEV" : "PROD"));

let dbConfig = {};

if (global.evaluatz_is_dev) {
  dbConfig = {
      host: 'localhost',
      port: 5432,
      database: "Evaluatz",
      user: 'postgres',
      password: ''
  }
} else {
  dbConfig = {
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      database: process.env.PG_DATABASE,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      ssl: true
  }
}



module.exports = {
  createPool: () => new Pool(dbConfig),
  execute: async function (pool, sqlQuery, values){
    return new Promise(resolve => {
       let rowsReturn = [];
        pool.connect()
        .then(client => {
            return client.query(sqlQuery, values)
            .then(res => {
                rowsReturn = res.rows;
                client.release();
            })
            .catch(e => {
                console.log(e);
                client.release();
            })
            .then(() => resolve(rowsReturn));
        });
    });
  }
}


