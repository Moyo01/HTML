import { LightningElement, api } from 'lwc';
import updatePriceBook2 from '@salesforce/apex/addProducts.updatePriceBook2';
// import Pricebook2Id from '@salesforce/schema/Contract.Pricebook2Id';

export default class ChoosePricebook extends LightningElement {

    @api parentId ;
    @api parentObjectApiName;
    fields=[ "Name" , "IsActive"];
    displayFields = 'Name, IsActive';
    recordId;
    showModal = false;
    errorMessage = false;
    showSpinner= false;

    handleLookup(event){
        let detail = event.detail;
        console.log(JSON.stringify(detail));
        this.recordId = detail.data.recordId; // undefined

    }

    handleCancel(event) {

        this.dispatchEvent(
            new CustomEvent('cancel'))
        this.showModal = false;
        }

        handleSave() {
            console.log(this.recordId);
            if(this.recordId){
               this.errorMessage=undefined;

            } else {
                this.errorMessage = `Please select a pricebook for this ${this.parentObjectApiName}`;
                console.log(this.errorMessage);
                return;
            }
            this.showSpinner = true;
            updatePriceBook2({
                priceBook2Id: this.recordId,
            objectApiName: this.parentObjectApiName,
            recordId: this.parentId
            }).then((result) => {
                this.dispatchEvent(
                    new CustomEvent('success', {
                      detail:  {priceBook2Id : this.recordId}
                    }));
                    this.showModal = false;
            }).catch((error) => {
                this.errorMessage = 'Error updating pricebook: ' + (error.body ? error.body.message : JSON.stringify(error));
            }) .finally(() => {
                this.showSpinner = false;
            });

            }
}