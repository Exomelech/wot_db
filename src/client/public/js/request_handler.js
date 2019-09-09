import Card from './card';
import { request } from './functions';

export default (function () {

  //-- Used for generate ajax request and updating cards by scrolling --//
  class RequestHandler {
    constructor(link, options) {
      Card.clearCards();
      this.link = link;
      this.options = options;
      this.count = 0;
      this.init();
    };

    init() {
      this.newRequest()
        .then(() => {
          this.initScrollCheck()
        });
    };

    newRequest() {
      this.update_state = false;
      return request('post', this.link, this.options)
        .then(data => this.parseRequest(data));
    };

    parseRequest(data) {
      this.drawCards(data.data);
      this.maxY = document.body.offsetHeight - window.innerHeight;
      this.count += data.data.length;
      this.total = data.meta.total;
      this.update_state = true;
    };

    drawCards(data) {
      for (let t in data) {
        new Card(data[t]);
      };
    };

    initScrollCheck() {
      window.addEventListener('scroll', e => {
        let scroll = (this.maxY - window.scrollY < 1500);
        if (scroll && this.count < this.total && this.update_state) {
          this.options.page_no++;
          this.newRequest();
        };
      });
    };

  };

  return RequestHandler;

}());