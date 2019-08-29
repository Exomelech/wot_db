//-- Express init, default 3000 port --//
const express = require('express');
const app = express();
const cors = require('cors'); // Б-г мерзкий корс, зочем он нужон? S: //
const jsonParser = express.json()
app.listen(3000);
app.use(cors());

const path = require('path');
const colors = require('colors');
const mysql_api = require('./lib/mysql_api');
const external_api = require('./lib/db_external_api');
const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

//-- Mount virtual fs for index.html --//
app.use(jsonParser)
    .use(express.static(path.join(__dirname, '../../dist')));

//-- Basic routing --//
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.get('/meta', jsonParser, (req, res) => {
    console.log( 'Client has requsted meta info!'.green);
    mysql_api.select('meta')
    .then((data) => {
        let obj = {
            meta:{
                status: 'ok'
            },
            data: data[0][0]
        };
        res.json(obj);
    });
});

app.post('/tanks', jsonParser, (req, res) => {
    console.log( 'Client has requsted tanks info!'.green);
    let sql_req = external_api.prepare_sql_obj(req.body);
    if( sql_req.status !== false ){
        mysql_api.select('tanks', sql_req.sql, ['tier', 'nation'])
            .then( data => external_api.generate_request_data(sql_req, req.body, data[0]) )
            .then( data => res.json(data) );
    }else{
        let data = external_api.generate_request_data(sql_req, req.body);
        res.json(data);
    };
});

app.get('/fetch', jsonParser, (req, res)=> {
    console.log( 'Client has requested fetch url!'.green, req.query.url );

    fetch(req.query.url)
        .then( data => data.text() )
        .then( data => res.json( data ) );

});