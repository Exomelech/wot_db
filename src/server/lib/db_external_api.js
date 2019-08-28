const hash = require('object-hash');

module.exports = external_api = (function(){

    const external_api = {};
    const utils = {};
    const cached_requests = {};
    const sql_meta = ['nation', 'tier', 'type'];

    external_api.prepare_sql_obj = function(request){
        let sql = {};
        for( let key in request ){
            if( sql_meta.indexOf(key) !== -1 ){
                sql[key] = request[key]
            };
        };
        return {
            sql:sql,
            status: utils.init_cache_request(sql)
        }
    };

    utils.init_cache_request = function(sql){
        let cache = hash(sql);
        //console.log( 'SQL statement ',sql, 'Hashed req '+cache );
        if( !cached_requests[cache] ){
            cached_requests[cache] = {};
            return true;
        }else{
            return false;
        };
    };

    external_api.generate_request_data = function(sql, req, data){
        if( sql.status !== false ){
            cached_requests[hash(sql.sql)] = data;
        }else{
            //console.log( 'request already cached!' );
            data = cached_requests[hash(sql.sql)];
        };
        let meta = {
            status: 'ok',
            total: data.length,
            page_total: Math.ceil( data.length/req.limit )
        };
        let elems = [];
        let start = req.limit*(req.page_no - 1);
        let end = Math.min(req.limit*(req.page_no)-1, meta.total-1);
        
        for( let i = start ; i <= end ; i++){
            elems.push(data[i]);
        };
        
        return {
            meta: meta,
            data: elems
        };

    };

    return external_api;

}());