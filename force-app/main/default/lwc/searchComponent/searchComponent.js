import { LightningElement, track } from 'lwc';

export default class SearchComponent extends LightningElement {


    @track searchval;

    handleChange(event){
        const value = event.target.value;
        this.searchval=value;

        const searchEvent= new CustomEvent('search', {
            detail:  this.searchval
    });
    this.dispatchEvent(searchEvent);
    }
    
    }
   