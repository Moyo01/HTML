import { LightningElement, api, track } from 'lwc';
import getMetaRecords from '@salesforce/apex/metadataController.getRecords';

export default class QuickEditcomponent extends LightningElement {


    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;
    @track fieldsToEdit = [];
    @api placeToBeUsed;

    handleSuccess(event){

    }

    handleError(event){

    }
}