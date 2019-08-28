import Create from './create';
import { arabicToRoman } from './functions';

export default (function(){

    var cards = [];
    var card_holder = document.querySelector('.card__holder');
    var crew_string = {
        commander: "Командир экипажа",
        gunner: "Наводчик",
        loader: "Заряжающий",
        radioman: "Радист",
        driver: "Механик-водитель"
    };
    var armor_string = {
        hull: 'Корпус',
        turret: 'Башня'
    };
    var nation_string = {};
    var type_string = {};

    class Card {
        
        constructor(data) {
            this.dom = card_holder.newChild('div', '', 'card__item');
            this.data = data;
            cards.push(this);
            this.draw();
            this.addHoverResize();
        };
        
        addHoverResize() {
            this.height = this.expanded.offsetHeight + 'px';
            this.expanded.style.height = '0px';
            this.dom.addEventListener('mouseenter', () => {
                this.expanded.style.height = this.height;
            });
            this.dom.addEventListener('mouseleave', () => {
                this.expanded.style.height = '0px';
            });
        };
        
        draw() {
            this.dom.innerHTML = `
            <div class="card__minimized">
                <span class='minimized__title'>${arabicToRoman(this.data.tier)} - ${this.data.name}</span>
                <img class='minimized__icon' src="${this.data.images.small_icon}" alt="">
            </div>
            <div class="card__expanded">
                <img src="${this.data.images.big_icon}" alt="" class="card__img">
                <div class="card__info">
                    <div class='card__text'>Название танка: ${this.data.name}</div>
                    <div class='card__text'>Тип танка: ${type_string[this.data.type]}</div>
                    <div class='card__text'>Страна производитель: ${nation_string[this.data.nation]}</div>
                    <div class='card__text'>Общая информация: ${this.data.description}</div>
                </div>
            </div>`;
            this.expanded = this.dom.querySelector('.card__expanded');
            this.addCardInfo();
        };
        
        addCardInfo() {
            this.card_info = this.dom.querySelector('.card__info');
            this.createCrewTable();
            this.createArmorTable();
            this.createWeaponTable();
            this.addMobilityInfo();
        };
        
        addGeneralInfo() {
            this.card_info.newChild('div', 'Название танка: ' + this.data.name, 'card__text');
            this.card_info.newChild('div', 'Тип танка: ' + type_string[this.data.type], 'card__text');
            this.card_info.newChild('div', 'Нация производитель: ' + nation_string[this.data.nation], 'card__text');
            this.card_info.newChild('div', 'Общая информация: ' + this.data.description, 'card__text');
        };
        
        createCrewTable() {
            let table = this.card_info.newChild('table', 'Экипаж', 'card__table');
            table.addRowHeader(['Список членов экипажа', 'Исполняемые обязанности']);
            this.data.crew.map(el => {
                let crew_id = crew_string[el.member_id];
                let roles = el.roles.toString(', ');
                table.addRow([crew_id, roles.capitalizeFirstLetter()]);
            });
        };
        
        createArmorTable() {
            let table = this.card_info.newChild('table', 'Бронирование', 'card__table');
            table.addRowHeader(['Агрегат', 'Лоб', 'Борта', 'Корма']);
            let armor = this.data.armor;
            for (let s in armor) {
                if (armor[s] !== null) {
                    let armor_id = armor_string[s];
                    table.addRow(armor_id);
                    table.addToLastRow(armor[s]);
                };
            };
        };
        
        createWeaponTable() {
            let table = this.card_info.newChild('table', 'Вооружение', 'card__table');
            let gun = this.data.gun;
            table.addRow(['Название орудия', gun.name]);
            table.addRow(['Калибр', gun.caliber + ' мм']);
            table.addRow(['Боекомплект', gun.max_ammo + ' снаряда']);
            table.addRow(['Скорострельность', gun.reload_time + ' c']);
        };
        
        addMobilityInfo() {
            let mobil = this.data.mobility;
            let mass = (this.data.mass / 1000).toFixed(1);
            this.card_info.newChild('div', `Скорость переднего/заднего хода: ${mobil.speed_forward + '/' + mobil.speed_backward} км/ч`, 'card__text');
            this.card_info.newChild('div', `Скорость разворота на месте: ${mobil.traverse_speed} град/с`, 'card__text');
            this.card_info.newChild('div', `Масса снаряженного танка: ${mass} т`, 'card__text');
        };
        
        static setNationString(strings) {
            nation_string = strings;
        };
        
        static setTypeString(strings) {
            type_string = strings;
        };
        
        static clearCards() {
            cards = [];
            card_holder.innerHTML = '';
        };
    
    };

    return Card;

}());