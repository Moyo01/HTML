import { LightningElement } from 'lwc';

export default class NewContactComponent extends LightningElement {

    handleNextClick(event){
        event.preventDefault();
        const eventPrev = new CustomEvent('next', {
            detail: {
                showContact: false,
                showAccount: false,
            showOpportunity: true,
            showProduct: false
            }
    });
    this.dispatchEvent(eventPrev);
}

    handlePrevClick(event){
        event.preventDefault();
        const eventNext = new CustomEvent('prev', {
            detail: {
                showAccount: true,
                showContact: false,
                showOpportunity: false,
                showProduct: false
    }
});
this.dispatchEvent(eventNext);
    }
}