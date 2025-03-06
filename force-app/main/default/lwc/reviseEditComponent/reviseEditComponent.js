import { LightningElement, api, track, wire } from 'lwc';
import getMetaRecords from '@salesforce/apex/metadataController.getRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class ReviseEditComponent extends LightningElement {

    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;
    @track fieldsToEdit = [];
    @api placeToBeUsed;

    lenght
    

    @wire(getMetaRecords, { 
        objectApiName: '$objectApiName',
        placeToBeUsed: '$placeToBeUsed',
        Usedfor: 'Edit Record'
    })

    wiredData({data, error}){
        if (data) {
            console.log('metadata ', data);
            this.fieldsToEdit = data.map((field) => {
                return {
                    objectApiName: field.Object_Api_Name__r.QualifiedApiName ,
                     fieldApiName: field.Field_Api_Name__r.QualifiedApiName
                }
            });
            if(this.fieldsToEdit && this.fieldsToEdit.length > 0){
                this.length = 1
               
            } else {
                this.length = 0;
            }

    } if(error){
        this.error = error;
       
    }
    }


    handleSuccess(event){
        event.preventDefault();
        this.dispatchEvent(new CustomEvenet('success'));
    }

    handleError(event){
        event.preventDefault();
        this.dispatchEvent(new CustomEvenet('error'));
    }

    handleCancel(){
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    

}