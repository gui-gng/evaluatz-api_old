const db = require('./database');

pool = db.createPool();
 
module.exports = function() {
    this.insert = async (product_price, product_path_id, product_source, product_id_on_source, product_currency) => {
        await insert(product_price, product_path_id, product_source, product_id_on_source, product_currency);
    }
}

async function insert(product_price, product_path_id, product_source, product_id_on_source, product_currency){
    return new Promise(resolve => {
        let sqlQuery = "INSERT INTO public.products(product_price, product_path_id, product_source, product_id_on_source, product_currency)";
        let values = [product_price, product_path_id, product_source, product_id_on_source, product_currency];
        resolve(db.execute(pool, sqlQuery, values));
    });
}



