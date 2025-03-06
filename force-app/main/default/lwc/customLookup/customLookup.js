import { api, LightningElement, track } from 'lwc';
import findRecords from '@salesforce/apex/lookupControllerLWC.findRecords';

export default class CustomLookup extends LightningElement {
    @api objectApiName = "Account";
    @api fieldApiName = "Name";
    @api iconname = "standard:account";
    @track records ; 
    @track selectedRecord;
    @track error;

    handleSearch(event) {
        const searchValue = event.detail;

        findRecords({
            objectName : this.objectApiName,
            fieldApiName : this.fieldApiName,
            searchValue : searchValue
        })
        .then(result => {
            console.log('results are ', result);
            this.records = result; 
            for(let i=0; i<this.records.length; i++){
                if(this.records[i]){
                    this.records[i].Name = this.records[i][this.fieldApiName];
                }
            }
            this.error = undefined;
        })
        .catch(error => {
            console.error('Error fetching records:', error);
            this.error = error;
            this.records = undefined;
        });
    }

    handleSelect(event) {
        const recordId = event.detail;
            const selectedRec = this.records.find(
                    record => record.Id === recordId
                
                );
         console.log(' Selected Record ', selectedRec);  
            this.selectedRecord = selectedRec;
    }

    handleRemove(){
        this.selectedRecord=undefined;
        this.error=undefined;
        this.records=undefined;
    }
}
