import { createNumerableObj, print, requestJSON } from './functions';
import Create from './create';
import Card from './card';
import Handler from './request_handler';
import deleteButtonSrc from '../icons/icon_cross_white.png';

export default (function(){

    const app_id = 'application_id='+'cd6a5428a070e83104de6020910a5619';
    var filters = [];
    var tiers = createNumerableObj(1, 10);
    var filter_request;

    const filter_menu = document.querySelector('.filter__menu');
    
    class Filter{
    
        constructor(title, filter_key){
            this.dom = filter_menu.newChild('li', '', 'filter__item');
            this.draw(title);
            this.filter_key = filter_key;
            this.filter_list = [];
        };
        
        draw(title){
            let drop = this.dom.newChild('div', title, ['drop__menu', 'list__item']);
            this.drop_list_dom = drop.newChild('ul', '', ['drop__list', 'list']);
            this.selected_list_dom = this.dom.newChild('ul', '', ['selected__list', 'list']);
        }

        addElement(title, filter_key){
            let elem = this.drop_list_dom.newChild('li', title, 'list__item');
            this.dropItemListener(elem, title, filter_key)
        };
        
        addElementsFromRequest(data){
            for( let key in data ){
                let elem = this.drop_list_dom.newChild('li', data[key], 'list__item');
                this.dropItemListener(elem, data[key], key);
            };
        };

        addElementSelectedMenu(title, filter_key){
            let elem = this.selected_list_dom.newChild('li', title, 'selected__item');
            this.drawDelButton(elem, filter_key);
            this.filter_list.push( filter_key );
        };

        drawDelButton(elem, key){
            let delete_button = elem.newChild('img', '', 'delete__button');
            delete_button.src = deleteButtonSrc;
            this.delButtonListener(delete_button, elem, key);
        };

        delButtonListener(button, parent, key){
            button.addEventListener('click', () => {
                this.selected_list_dom.removeChild(parent);
                this.filter_list.splice( this.filter_list.indexOf( key ), 1 );
            })
        }
        
        dropItemListener(item, title, key){
            item.addEventListener('click', () => {
                if( !this.filter_list.some( el => el === key ) ){
                    this.addElementSelectedMenu(title, key);
                };
            });
        };

        getFiltersString(){
            if( this.filter_list.length > 0 ){
                return '\&'+this.filter_key+'='+this.filter_list.slice().join();
            }else{
                return ''
            };
        };

        generateFilterObj(obj){
            if( this.filter_list.length > 0 ){
                return obj[this.filter_key] = this.filter_list;
            };
        };

        static initFilters(){
            let p = requestJSON('get', 'http://localhost:3000/meta')
            .then( data => data.data );
            
            p.then( data => {
                Card.setNationString(data.nations);
                Filter.createFilterList('Нации', data.nations, 'nation');
            }).catch( err => console.log(err) );
        
            p.then( data => {
                Card.setTypeString(data.types);
                Filter.createFilterList('Тип техники', data.types, 'type');
            }).then( () => {
                Filter.createFilterList( 'Уровень техники', tiers, 'tier');
            }).catch( err => console.log(err) );
            
            p.then( document.querySelector('.filter__submit').addEventListener('click', Filter.submitFilters ) );
        };

        static createFilterList(title, filter_data, filter_key){
            let filter_block = new Filter(title, filter_key);
            filter_block.addElementsFromRequest(filter_data);
            filters.push(filter_block);
        };
        
        static submitFilters(){
            let requestString = 'http://localhost:3000/tanks';
            let options = {
                limit: 16
            };
            for( let filter of filters ){
                filter.generateFilterObj(options);
            };
            console.log( options );
            new Handler(requestString, options);
        };
    
    };

    return Filter;

}());