const { Pool } = require('pg')




if (global.evaluatz_is_dev) {
  module.exports = {
    createPool: () => new Pool({
      host: 'localhost',
      port: 5432,
      database: "Evaluatz",
      user: 'postgres',
      password: '',
    })
  }
} else {
  module.exports = {
    createPool: () => new Pool({
      host: 'db-postgresql-evaluatz-do-user-5184838-0.db.ondigitalocean.com',
      port: 25060,
      database: "Evaluatz",
      user: 'evaluatz-user-api',
      password: 'oim98l32kq1xbh8t',
      ssl: true
    })
  }
}





