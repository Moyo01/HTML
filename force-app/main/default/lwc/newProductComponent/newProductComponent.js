import { LightningElement } from 'lwc';

export default class NewProductComponent extends LightningElement {

    handlePrevClick(event){
        event.preventDefault();
        const eventPrev = new CustomEvent('prev', {
            detail : {
                showAccount: false,
                showContact: false,
                showOpportunity: true,
                showProduct: false
            }
        });
        this.dispatchEvent(eventPrev);
    }
}