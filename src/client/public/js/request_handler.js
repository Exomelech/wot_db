import Card from './card' ;
import { sendJSON } from './functions' ;

export default (function(){

    function Handler(link, options){
        Card.clearCards();
        this.link = link;
        this.page_no = 1;
        this.options = options;
        this.options.page_no = this.page_no;
        this.newRequest()
            .then( data => this.parseRequestFirst(data) );
    };

    Handler.prototype.newRequest = function(){
        return sendJSON('post', this.link, this.options);
    };
    
    Handler.prototype.parseRequestFirst = function(data){
        this.count = data.meta.page_total;
        this.parseRequest(data);
        this.initScrollCheck();
    }

    Handler.prototype.updateCards = function(){
        this.newRequest().then( data => this.parseRequest(data) );
    };

    Handler.prototype.parseRequest = function(data){
        this.drawCards(data.data);
        this.maxY = document.body.offsetHeight - window.innerHeight;
        this.update_state = true;
    };

    Handler.prototype.drawCards = function(data){
        for( let t in data ){
            new Card(data[t]);
        };
    };

    Handler.prototype.initScrollCheck = function(){
        window.addEventListener('scroll', e => {
            let scroll_delta = this.maxY - window.scrollY;
            if( scroll_delta < 1500 && this.page_no < this.count && this.update_state ){
                this.page_no++;
                this.options.page_no = this.page_no;
                this.update_state = false;
                this.updateCards();
            };
        });
    };
    
    return Handler;

}());
