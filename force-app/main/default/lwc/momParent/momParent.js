import { api, LightningElement, track } from 'lwc';
import findRecords from '@salesforce/apex/lookupControllerLWC.findRecords';

export default class MomParent extends LightningElement {

    @api objectApiName= "Account";
    @api fieldApiName= "Name";
    @api iconname= "standard:account";;
    @track records;
    @track errors;

    handleSearch(event){
        const searchValue = event.detail;


        findRecords({
            objectName : this.objectApiName,
            fieldApiName : this.fieldApiName,
            searchValue : searchValue
        })
           .then ( result => {
                this.records =result;
                console.log('results are ', this.records);
                this.errors = undefined;
           })
           .catch(  error  => {
            this.errors = error;
            this.records = undefined;
           });
    }


}