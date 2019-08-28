/*
    Этот модуль для скачивания бд танчиков, парс ответа и запись его в собственную бд.
    Код можно сделать чище, но мне лень, это запускается один раз при инициализации новой бд на новом рабочем месте.
*/
const request = require('request-promise');
const mysql_api = require('./mysql_api');

module.exports = wgdbparser = (function(){

    const wgdbparser = {};

    const app_id = 'application_id=cd6a5428a070e83104de6020910a5619';
    const requestString = `https://api.worldoftanks.ru/wot/encyclopedia/vehicles/?${app_id}&limit=1&page_no=`;
    var page_no = 599;

    wgdbparser.startParse = function(){
        
        let options = {
            method: 'GET',
            url: requestString+page_no,
            json: true
        };

        request(options)
            .then( response => dataParser(response.data) )
            .then( arr => mysql_api.insert('tanks', arr.columns, arr.args) )
            .then( res => { 
                    console.log(`Done ${page_no}/613`);
                    page_no++;
                    if( page_no <= 613 ){
                        wgdbparser.startParse();
                    }else{
                        console.log( 'Parse done' );
                    };
                }
            );
    };

    var dataParser = function(data){

        let obj = {
            columns: [],
            args: []
        };
        let key = Object.keys(data)[0];
        let inner_data = data[key];
        let dp = inner_data.default_profile;

        obj.columns.push('id_base');
        obj.args.push(key);
        obj.columns.push('name'); 
        obj.args.push( inner_data.name.replace(/\'/g, "-") );
        obj.columns.push('tier'); 
        obj.args.push(inner_data.tier);
        obj.columns.push('tag_name'); 
        obj.args.push(inner_data.tag);
        obj.columns.push('type'); 
        obj.args.push(inner_data.type);
        obj.columns.push('nation'); 
        obj.args.push(inner_data.nation);
        obj.columns.push('mass'); 
        obj.args.push(dp.weight);
        obj.columns.push('description'); 
        obj.args.push( inner_data.description.replace(/\'/g, "-") );
        obj.columns.push('crew'); 
        obj.args.push(JSON.stringify(inner_data.crew));
        obj.columns.push('images'); 
        obj.args.push(JSON.stringify(inner_data.images));
        obj.columns.push('armor'); 
        obj.args.push(JSON.stringify(dp.armor));
        obj.columns.push('gun'); 
        obj.args.push(JSON.stringify({
            name: dp.gun.name.replace(/\'/g, "-"),
            caliber: dp.gun.caliber,
            reload_time: dp.gun.reload_time,
            max_ammo: dp.max_ammo
        }));
        obj.columns.push('mobility'); 
        obj.args.push(JSON.stringify({
            speed_forward: dp.speed_forward,
            speed_backward: dp.speed_backward,
            traverse_speed: dp.suspension.traverse_speed
        }));

        return obj;
    };

    return wgdbparser;

}());

wgdbparser.startParse();
