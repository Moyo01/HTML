import { LightningElement, track } from 'lwc';

export default class Son1 extends LightningElement {

    @track searchval;


    handleChange(){
        const value = event.target.value;
         this.searchval=value;

         const searchEvent = new CustomEvent('search',{
            detail : this.searchval
         });

         this.dispatchEvent(searchEvent);
    }
}