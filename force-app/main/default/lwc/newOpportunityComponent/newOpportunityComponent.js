import { LightningElement } from 'lwc';

export default class NewOpportunityComponent extends LightningElement {

    handlePrevClick(){
        event.preventDefault();
        const eventNext = new CustomEvent('prev', {
            detail: {
                showAccount: false,
                showContact: true,
                showOpportunity: false,
                showProduct: false
            }
    });
    this.dispatchEvent(eventNext);
}


    handleNextClick(){
        const eventPrev = new CustomEvent('next', {
            detail: {
                showAccount: false,
                showContact: false,
                showOpportunity: false,
                showProduct: true
            }
        });
        this.dispatchEvent(eventPrev);
    }
}