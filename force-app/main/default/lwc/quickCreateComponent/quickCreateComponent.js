import { LightningElement, api, track, wire } from 'lwc';
import getMetaRecords from '@salesforce/apex/metadataController.getRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const DEFAULT_STYLE = 'color: red; font-weight: bold;';


export default class QuickCreateComponent extends LightningElement {

    // Flexipage provides recordId and objectApiName
    @api objApiName = 'Case';
    @api placeToBeUsed = 'Case Record Page';

    @track fieldsToCreate = [
        { objectApiName: 'Case', fieldApiName: 'Subject' },
        { objectApiName: 'Case', fieldApiName: 'Status' },
        { objectApiName: 'Case', fieldApiName: 'Description' }

    ];

    visibleDetails = false;
    length;
    style = DEFAULT_STYLE;

    get messageStyle() {
        return this.style;
    }

    set messageStyle(value) {
        this.style = value;
    }


    @wire(getMetaRecords, {
             objectApiName: '$objApiName',
            placeToBeUsed: '$placeToBeUsed',
            Usedfor: 'Add New Record'
           
    })
    wiredMetadata({ error, data }) {
        if (data) {
            console.log('metadata ', data);
            this.fieldsToCreate = data.map((field) => {
                return {
                    objectApiName: field.Object_Api_Name__r.QualifiedApiName ,
                     fieldApiName: field.Field_Api_Name__r.QualifiedApiName
                }
            });

    if(this.fieldsToCreate && this.fieldsToCreate.length > 0){
        this.length = this.fieldsToCreate.length;
       // this.visibleDetails = true;
    } else {
        this.length = 0;
    }
    } if(error){
        this.error = error;
       
    }
    }
    handleSuccess(event){
        event.preventDefault();
        const SuccessEvent = new ShowToastEvent({
            title: 'Success',
            message:  'Record Created',
            variant: 'success',
        });
        this.dispatchEvent(SuccessEvent);
    }

    handleError(event){
        event.preventDefault();
        let SuccessEvent = new ShowToastEvent({
            title: event.detail.message,
            message:  event.detail.message,
            variant: 'error',
        });
        this.dispatchEvent(SuccessEvent);
    }

    handleLoad(event){
        event.preventDefault();
        this.visibleDetails = true;
        console.log(this.visibleDetails);
    }
}