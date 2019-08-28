function getRandomNum(min,max){
    if( min>max ){
        console.warn("getRandomNum: min value greater then max value");
    }else{
        return Math.floor( min+Math.random()*(max+1-min) );
    };
};

function Color(r, g, b, a){
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = 255/a || 1;
    this.cssColor = 'rgba('+r+', '+g+', '+b+', '+a+')';
};

export function print(){
    for( let text of arguments ){
        console.log(text);
    };
};

export function arabicToRoman(num){
    let roman = {
        1:'I',
        2:'II',
        3:'III',
        4:'IV',
        5:'V',
        6:'VI',
        7:'VII',
        8:'VIII',
        9:'IX',
        10:'X'
    };
    return roman[num];
};

Object.prototype.toString = function(splitter){
    let ret = ''
    let spl = splitter ? splitter : ',';
    for( let i in this ){
        ret += this[i] + spl;
    };
    return ret.slice(0, ret.length - spl.length);
};

String.prototype.capitalizeFirstLetter = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
};

export function createNumerableObj(min, max){
    let obj = {};
    let num = max - min + 1;
    Array(num).fill(num).map( (el, i) => obj[i+1] = i+1 );
    return obj;
};

function request(method, url){
    return new Promise( (res, rej) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.addEventListener('load', res);
        xhr.addEventListener('error', rej)
        xhr.send();
    });   
};

export function requestJSON(method, url){
    return request(method, url)
    .then( res => JSON.parse(res.target.response) );
};

export function sendJSON(method, url, data){
    return new Promise( (res, rej) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.addEventListener('load', res);
        xhr.addEventListener('error', rej)
        xhr.send(JSON.stringify(data));
    })
    .then( res => JSON.parse(res.target.response) );
};