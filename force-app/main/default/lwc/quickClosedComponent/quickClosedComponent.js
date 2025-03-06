import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class QuickClosedComponent extends LightningElement {


    @api recordId;
    @api objectApiName;
    @api placeToBeUsed;

    showCloseComponent = false;
   
    handleClick(){
        this.showCloseComponent= true;
    }
    
    handleCancel(){
        this.showCloseComponent= false;
    }

    handleSuccess(event){
        event.preventDefault();
        const SuccessEvent = new ShowToastEvent({
            title: 'Success',
            message:  'Record Updated',
            variant: 'success',
        });
        this.dispatchEvent(SuccessEvent);
        
    }

    handleError(){
        let ErrorEvent = new ShowToastEvent({
            title: event.detail.message,
            message:  event.detail.message,
            variant: 'error',
        });
        this.dispatchEvent(ErrorEvent);
    }
}