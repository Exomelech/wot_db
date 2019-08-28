module.exports = mysql_sql = (function(){
    
    const mysql_sql = {};
    const utils = {};

    mysql_sql.insert = function(table, columns, args){
        if( columns ){
            return `INSERT INTO ${table} (${columns}) VALUES ('${args.join("','")}')`;
        };
    };

    utils.count_matches = function(colm, val){
        let matches = {};
        colm.map( (el,i) => {
            if( !matches[el] ){
                matches[el] = [val[i]];
            }else{
                matches[el].push(val[i]);
            };
        });
        return matches;
    };

    utils.ao_parser = function(cond){
        if( typeof cond === 'object' ){
            let ret = "";
            for( let key in cond ){
                let values = cond[key];
                let prefix = ret==='' ? '' : ` AND `;
                if( values.length > 1 ){
                    ret += `${prefix}( ${key}='${values.join(`' OR ${key}='`)}' )`;
                }else{
                    ret += `${prefix}${key}='${values}'`;
                };
            };
            return ret;
        }else{
            return `${cond}`;
        };
    };

    mysql_sql.delete = function(table, columns, conditions){
        return `DELETE FROM ${table} WHERE ${utils.ao_parser(columns, conditions)}`;
    };

    mysql_sql.select = function(table, obj){
        let order = obj.orders ? `ORDER BY ${obj.orders}` : '' ;
        if( obj.conditions && Object.keys(obj.conditions).length > 0 ){
            return `SELECT * FROM ${table} WHERE ${utils.ao_parser(obj.conditions)} ${order}`;
        }else{
            return `SELECT * FROM ${table} ${order}`;
        };
    };

    return mysql_sql;

}());