const db = require('./database');

pool = db.createPool();
 
module.exports = function() {
    this.insertFileByPath = async (file_path, file_is_local, file_link, file_type, file_source) => {
        let file_is_local_num = file_is_local?1:0;

        let file_path_obj =  await getPathByName(file_path);
        //Create path if dont exist
        if(file_path_obj.length == 0){
            console.log("Path not found")
            file_path_obj= await insertPath(file_path);
            console.log(file_path_obj)
        }
        let file_id_path = file_path_obj[0].path_id;
        await insertFile(file_id_path, file_is_local_num, file_link, file_type, file_source);
    },
    this.getListFiles = async (path_name) => {
        let list = {};
        let path_description_type = await getPathDescriptionType();
        let file_path = await getFilePath(path_name);
        let path_types = path_description_type.filter(pdt => pdt.path_level == 1);

        for(let pt = 0;pt < path_types.length;pt++){
            list[path_types[pt].path_type] = [];
        }

        for(let i = 0;i < file_path.length;i++){
            let fp = file_path[i];
            let field_values = fp.path.split("/");
            let field_names = path_description_type.filter((pdt) => {
                let pdt_f = path_description_type.filter(pdt_ => pdt_.path_description_id == fp.path_description_id);
                return pdt_f[0].path_type_id == pdt.path_type_id;
            });
            let strJson = "{";
            strJson = strJson + '"id": ' + fp.file_id + ',';
            strJson = strJson + '"link": "' + fp.file_link + '",';
            strJson = strJson + '"type": "' + fp.file_type + '",';
            strJson = strJson + '"source": "' + fp.file_source + '",';
            strJson = strJson + '"strSearch": "' + field_values + '",';
            strJson = strJson + '"attributes": {';
            for(let f = 1;f < field_names.length;f++){
                strJson = strJson + '"' + field_names[f].path_description + '":"' + field_values[f] + '"';
                strJson = strJson + (f < field_names.length-1 ?  "," : "");
            }
            
            strJson = strJson + "}}";
            let json = JSON.parse(strJson);
            list[field_names[0].PATH_TYPE].push(json)
        }
        return list;
    },
    this.getList = async () => {
        // let path_description_type = await getPathDescriptionType();
        let file_path = await getPath();
        return file_path.filter(fp => fp.path_description_id == 4);
    },
    this.getCategories = async () => {
        return getPathType();
    }
};


//=============================================================
//===========================PATH==============================
//=============================================================
/**
 * Get all paths
 */
async function getPath(){
    return new Promise(resolve => {
        let sqlQuery = "SELECT * FROM public.path";
        let values = [];
        resolve(db.execute(pool, sqlQuery, values));
    });
}
/**
 * Get all paths by name
 * @param {String} path_name
 */
async function getPathByName(path_name){
    return new Promise(resolve => {
        let sqlQuery = "SELECT * FROM public.path where path=$1";
        let values = [path_name];
        resolve(db.execute(pool, sqlQuery, values));
    });
}

/**
 * Insert path
 * @param {String} path_name
 */
async function insertPath(path_name){
    console.log("Inserting path: " + path_name)
    
    let path_name_split = path_name.split("/");
    let path_type = path_name_split[0].toUpperCase();
    let path_level = path_name_split.length;
    console.log("Path level: " + path_level)
    console.log("Path type: " + path_type);

    let path_type_obj = await getPathDescriptionType(path_type, path_level);
    console.log("PATH_TYPE")
    console.log(path_type_obj);
    if(!path_type_obj){
        await insertPathType(path_type);
        path_type_obj = await getPathDescriptionType(path_type, path_level);
    }
    let path_description_id = path_type_obj[0].path_description_id;
    console.log(path_description_id);

    return new Promise(resolve => {
        let sqlQuery = "INSERT INTO public.path(path_description_id, path) VALUES ($1, $2)";
        let values = [path_description_id, path_name];
        resolve(db.execute(pool, sqlQuery, values));
    });
}

//=============================================================
//========================PATH_TYPE============================
//=============================================================
/**
 * Get the object path_type

 * @param {String} path_type 
 */
async function getPathType(path_type){
    
    return new Promise(resolve => {
        let text = "SELECT * FROM public.path_type";
        let values = [];
        if(path_type){
            console.log("Searching path_type: " + path_type)
            text = text + " where path_type = $1";
            values = [path_type];
        }
        
        resolve(db.execute(pool, text, values));
    });
}
/**
 * Insert  path_type
 * @param {String} path_type 
 */
async function insertPathType(path_type){
    
    return new Promise(resolve => {
        let text = "SELECT * FROM public.path_type where path_type = $1";
        let values = [path_type];
        resolve(db.execute(pool, text, values));
    });
}





//=============================================================
//===========================FILE==============================
//=============================================================
/**
 * Insert file
 * @param {Inteher} file_id_path 
 * @param {Boolean} file_is_local 
 * @param {String} file_link 
 * @param {String} file_type 
 * @param {String} file_source 
 */
async function insertFile(file_id_path, file_is_local, file_link, file_type, file_source){
    console.log("Inserting File: " + file_link)
    return new Promise(resolve => {
        let text = 'INSERT INTO public.files(file_id_path, file_is_local, file_link, file_type, file_source) VALUES ($1, $2, $3, $4, $5)'
        let values = [file_id_path, file_is_local, file_link, file_type, file_source]
        resolve(db.execute(pool, text, values));
    });
}





//=============================================================
//============================VIEWS============================
//=============================================================
async function getPathDescriptionType(path_type, path_level){
    let text = "SELECT * FROM public.path_description_type";
    let values = [];

    if(path_type && path_level){
        console.log("Searching path_description_type: " + path_type + " LVL: " + path_level);
        text = text + " where path_type = $1 AND path_level = $2";
        values = [path_type, path_level];
    }
    return new Promise(resolve => {
        resolve(db.execute(pool, text, values));
    });
}
async function getFilePath(path_name){
    return new Promise(resolve => {
        let sqlQuery = "SELECT * FROM public.file_path";
        let values = [];
        if(path_name){
            sqlQuery = sqlQuery + " where path = $1"
            values = [path_name]
        }
        resolve(db.execute(pool, sqlQuery, values));
    });
}



