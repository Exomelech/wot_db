import Filter from './filter';
import { requestJSON } from './functions';

Filter.initFilters();

const base = 'https://get-tune.cc/search/f/';
const url = 'http://localhost:3000'
const search = 'govno';
const fetch_options = {
    method: 'GET',
    mode: 'no-cors',
    redirect: 'follow',
    headers: {
        "Accept": "application/json"
    }
};

requestJSON('GET', `${url}/fetch/?lols`)
.then( data => console.log(data) )
