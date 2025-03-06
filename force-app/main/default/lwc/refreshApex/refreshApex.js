import { LightningElement, wire } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import acclist from '@salesforce/apex/AccountController.acclist';
import { refreshApex } from '@salesforce/apex';

   const columns = [
           { label: 'Name', fieldName: 'Name' },
           { label: 'Phone', fieldName: 'Phone' },
           { label: 'Rating', fieldName: 'Rating' },
           { label: 'Industry', fieldName: 'Industry' }
    ];
    export default class RefreshApex extends LightningElement {


    cols= columns;
    selectedRecord;
    accountList=[];
    error;
    wiredList=[];


    @wire(acclist)
        acclist(result){
            this.wiredList = result;
            if(result.data){
                this.accountList= result.data;
                this.error= undefined;
            } else if(result.error){
                this.error = result.error;
                this.accountList= undefined;
             }

        }

        /*
        handleSelection(event){
            if(event.detail.selectedRows.length > 0){
                this.selectedRecord = event.detail.selectedRow[0].Id;
            }
        }
            */

        handleSelection(event) {
            const selectedRows = event.detail.selectedRows;
            
            if (selectedRows.length > 0) {
                this.selectedRecord = selectedRows[0].Id;  // Ensure you use `Id`
            } else {
                this.selectedRecord = null;
            }
    
            console.log('Selected Record:', this.selectedRecord);
        }

        handleDelete(event){
            deleteRecord(this.selectedRecord)
             .then(() => {
                refreshApex(this.wiredList);
             })
             .catch(error => {
                 this.error = error;
             });     
        }
}