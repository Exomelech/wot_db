export default (function(){

    Element.prototype.newChild = function(tag, text, classList){
        let child = document.createElement(tag);
        child.innerText = text;
        child.addClass(classList);
        this.appendChild(child);
        return child;
    };

    Element.prototype.addClass = function(classList){
        if( classList!==undefined ){    
            if( Array.isArray(classList) ){
                this.classList.add(...classList);
            }else{
                this.className = classList;
            };
        };
    };

    Element.prototype.addRowHeader = function(args){
        let row = this.insertRow();
        if( typeof args === 'object' ){
            for( let k in args ){
                row.insertCell().outerHTML = '<th>'+args[k]+'</th>';
            };
        }else{
            row.insertCell().outerHTML = '<th>'+args+'</th>';
        }
    };

    Element.prototype.addRow = function(args){
        let row = this.insertRow();
        if( typeof args === 'object' ){
            for( let k in args ){
                row.insertCell().innerText = args[k];
            };
        }else{
            row.insertCell().innerText = args;
        };
    };

    Element.prototype.addToLastRow = function(args){
        let row = this.rows;
        row = row[row.length - 1];
        if( typeof args === 'object' ){
            for( let k in args ){
                row.insertCell().innerText = args[k];
            };
        }else{
            row.insertCell().innerText = args;
        };
    };

}());