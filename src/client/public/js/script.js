import Filter from './filter';
import { requestJSON } from './functions';

Filter.initFilters();

const base = 'https://wiki.wargaming.net/ru/Tank:R11_MS-1';
//const base = 'https://get-tune.cc/search/f/govno';
//const base = 'https://api.github.com/users/github';
const url = 'http://localhost:3000'
const match = `<ul class="gallery">`;

function parseRequest(str){
    let data = str;
    let ret = [];
    for( let i = 0; i<=2 ; i++ ){
        let obj = {};
        let title = data.slice( data.search(/<img alt=/i)+10, data.search(/" src=/i) );
        let small_png = data.slice( data.search(/" src=/i)+7, data.search( /" \/>/i ) );
        data = data.slice( data.search(/<\/div><\/li>/i)+10 );
        let big_png = 'https://wiki.gcdn.co/images'+small_png.slice( small_png.search(/thumb/i)+5,small_png.search(/thumb/i)+11 )+title;
        ret.push({
            small: small_png,
            big: big_png
        });
    };
    return ret;
};

requestJSON('GET', `${url}/fetch?url=${base}`)
    .then( data => {
        let preparse = data.slice( data.search( /<ul class="gallery">/i ));
        let endparse = preparse.slice( 0, preparse.search( /<\/ul>/i ) ); 
        parseRequest(endparse);
        //console.log( endparse );
    });

