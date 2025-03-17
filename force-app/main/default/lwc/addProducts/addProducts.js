import { LightningElement, api, track, wire } from 'lwc';
import LineItem from '@salesforce/apex/addProducts.queryLineitemRecords';
import priceBookId from '@salesforce/apex/addProducts.fetchPriceBookId';
import { deleteRecord } from 'lightning/uiRecordApi';
import getPriceBookEntries from '@salesforce/apex/addProducts.getPriceBookEntries';
import submitProducts from '@salesforce/apex/addProducts.submitProducts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import listLineItem from '@salesforce/apex/addProducts.listLineItem';
import searchProducts from 'c/searchProducts';

export default class AddProducts extends LightningElement {

    @api recordId;
    @api objectApiName;
    priceBookQuery= '';
    priceBookId;
    isLoading = false;
    showModal = false;
    priceBook2Id;
    priceBookEntryMap= {};
    errorMessage;

    objectApiNameMap = {
        'Quote' : 'QuoteId',
        'Order' : 'OrderId',
        'Opportunity' : 'OpportunityId'
    }

    fields=[ "Name" , "ProductCode" , "Family"];
    displayFields = 'Name, ProductCode, Family';

    query= '';

    @track records = [];
    @track error;
    index;
    lookupValue;


    @wire(getPriceBookEntries, {
        PriceBook2Id: '$priceBook2Id'
    })
    wiredPriceBookEntries(result) {
        let data = result.data;
        let error = result.error;

        if (data) {
            console.log('PriceBookEntries received:', data.length);
            this.priceBookEntryMap = {};
            data.forEach(element => {
                this.priceBookEntryMap[element.Product2Id] = element.Id;
            });
            console.log('PriceBookEntryMap populated with keys:', Object.keys(this.priceBookEntryMap).length);
        }
        if (error) {
            console.error('Error getting PriceBookEntries:', error);
            this.error = error;
        }
    }

    connectedCallback() {
        //code to fetch the records
        this.isLoading = true;
        this.priceBookQuery =  `SELECT PriceBook2Id FROM ${this.objectApiName} WHERE Id = '${this.recordId}' LIMIT 1`;

        if(this.objectApiName === 'Opportunity'){
            this.query = `SELECT Id, OpportunityId, SortOrder, PricebookEntryId, Product2Id, ProductCode, 
                Name, Quantity, TotalPrice, UnitPrice, ListPrice, ServiceDate, Description,
                Product2.Name
                FROM OpportunityLineItem
                WHERE OpportunityId = '${this.recordId}'
            `;
           
        } else if (this.objectApiName === 'Order') {
            // Query OrderItems related to this Order
            this.query = `SELECT Id, Product2Id, OrderId, PricebookEntryId, 
            Quantity, UnitPrice, ListPrice, 
            Product2.Name,
            TotalPrice, ServiceDate, Description FROM OrderItem
            WHERE OrderId = '${this.recordId}'
        `;    
         } else if (this.objectApiName === 'Quote') {
            this.query = `SELECT Id, LineNumber, QuoteId, 
                PricebookEntryId, Quantity, UnitPrice, 
                Product2.Name,
                Description, ServiceDate, Product2Id, ListPrice, TotalPrice FROM QuoteLineItem
                WHERE QuoteId = '${this.recordId}'`;
            
        }
        console.log('Query built:', this.query);
    }

    @wire(priceBookId, {
        query: '$priceBookQuery'
    })
     
    wiredPriceBook(result) {
        let error = result.error;
        let data = result.data;

        if (data) {
            console.log('PriceBook Record', data);
            if (data.length && data.length > 0) {
                this.priceBookId = data[0].Pricebook2Id;
                this.priceBook2Id = data[0].Pricebook2Id; // Make sure both are set
                console.log('PriceBook2Id set to:', this.priceBook2Id);
                this.error = undefined;
                this.showModal = !this.priceBookId;
            } else {
                console.log('No PriceBook found, showing modal');
                this.showModal = true;
            }
        } 
        
        if (error) {
            console.error('Error in wiredPriceBook:', error);
            this.error = error;
            this.showModal = true; // Show modal in case of an error
        }
    }

    @wire(LineItem, {
        query: '$query'
    })
    wiredLineItem(result){
        let error = result.error;
        let data = result.data;
        if (data) {
            console.log('wiredLineItem results:', data.length);
            this.records = JSON.parse(JSON.stringify(data));
        } else if (error) {
            console.error('Error in wiredLineItem:', error);
            this.error = error;
        }
        this.isLoading = false;
        this.addRow();
    }

    addRow(){
        this.records.push({
            Quantity: null,
            Description: '',
            UnitPrice: null,
            ServiceDate: null
        });
        console.log('Added new row, total rows:', this.records.length);
    }

    handleLookup(event){
        let detail = event.detail;
        this.records[detail.data.index][detail.data.parentAPIName] = detail.data.recordId;
        console.log(`Set ${detail.data.parentAPIName} to ${detail.data.recordId} at index ${detail.data.index}`);
    }

    handleDelete(event) {
        // Get the index from the data attribute
        const indexToDelete = event.target.dataset.index;
        const recordId = event.target.dataset.recordId;
        // Delete the record
        if(recordId){
            this.isLoading = true;
            deleteRecord(recordId)
            .then(() => {
                // Remove the deleted record from the array
                this.records.splice(indexToDelete, 1);
                console.log(`Record ${recordId} deleted successfully`);
            })
            .catch(error => {
                // Handle error
                console.error('Error deleting record:', error);
            })
            .finally(() => {
                this.isLoading = false;
            });   
        } else {
            this.records.splice(indexToDelete, 1);
            console.log(`Row at index ${indexToDelete} removed (no recordId)`);
        }
    }

    handleDetailPage(event){
        event.preventDefault();
        let recordId = event.target.dataset.recordId;
        if(recordId){
            const recordUrl = `https://${location.host}/lightning/r/Product2/${recordId}/view`;
            location.href = recordUrl;
        }
    }

    handleChange(event){
        event.preventDefault();
        let index = event.currentTarget.dataset.index;
        let name = event.currentTarget.name;
        let value = event.currentTarget.value;
        this.records[index][name] = value;
    }

    handleCancel(event){
        this.showModal = false;
    }

    handleSave(event){
        event.preventDefault();
        this.showModal = false;
        this.priceBook2Id = event.detail.priceBook2Id;
        console.log('PriceBook2Id set from modal:', this.priceBook2Id);
    }

    handleChoosePriceBook(event){
        this.showModal = true;
    }

    submitRecords(event){
        event.preventDefault();
        this.errorMessage = '';
        
        let allValid = this.validateInput();
        if(!allValid){
            console.log('Input validation failed');
            return;
        }

        // Product validation
        let hasInvalidProducts = false;
        this.records.forEach((line, index) => {
            if (!line.Id && !line.Product2Id) {
                hasInvalidProducts = true;
                console.log(`Missing Product2Id at index ${index}`);
            }
        });
        
        if(hasInvalidProducts){
            this.errorMessage = 'Please select the product for all the line items!';
            console.log('Product validation failed:', this.errorMessage);
            return;
        }

        // Check if priceBookEntryMap is populated
        if (Object.keys(this.priceBookEntryMap).length === 0) {
            this.errorMessage = 'Price book entries are not loaded. Please try again or select a different price book.';
            console.log('PriceBookEntryMap validation failed:', this.errorMessage);
            return;
        }

        // Prepare records for upsert
        this.isLoading = true;
        let recordsToSubmit = JSON.parse(JSON.stringify(this.records)); // Deep copy
        let hasErrors = false;

        recordsToSubmit.forEach((line, index) => {
            if (!line.Id) {
                console.log(`Processing new line at index ${index}, Product2Id: ${line.Product2Id}`);
                
                // Verify PricebookEntryId exists for this Product2Id
                if (!this.priceBookEntryMap[line.Product2Id]) {
                    hasErrors = true;
                    this.errorMessage = `PricebookEntry not found for product at row ${index + 1}. Please verify the product is in the selected price book.`;
                    console.log(`PricebookEntry not found for Product2Id: ${line.Product2Id}`);
                    return;
                }
                
                line.PricebookEntryId = this.priceBookEntryMap[line.Product2Id];
                console.log(`Set PricebookEntryId to ${line.PricebookEntryId} for Product2Id ${line.Product2Id}`);
                
                let parentApiName = this.objectApiNameMap[this.objectApiName];
                line[parentApiName] = this.recordId;
                
                // Keep Product2Id for reference (won't be used in insert/update)
                // line.Product2Id = undefined; // Removing this line
            }
        });

        if (hasErrors) {
            this.isLoading = false;
            return;
        }

        console.log('Submitting records:', JSON.stringify(recordsToSubmit));
        
        submitProducts({
            objectApiName: this.objectApiName,
            records: JSON.stringify(recordsToSubmit),
        })
        .then((result) => {
            console.log('Records added successfully:', result);
            
            const toastEvent = new ShowToastEvent({
                title: 'Success',
                message: 'Records added successfully',
                variant: 'success',
            });
           this.dispatchEvent(toastEvent);
      
           // Refresh line item list
           return listLineItem({
               query: this.query
            });
        })
        .then((result) => {
            console.log('Line items refreshed, count:', result.length);
            this.records = JSON.parse(JSON.stringify(result));
            this.addRow();
        })
        .catch((error) => {
            console.error('Error submitting products:', error);
            const ErrorEvent = new ShowToastEvent({
                title: 'Error',
                message: error.body ? error.body.message : JSON.stringify(error),
                variant: 'error',
            });
            this.errorMessage = error.body ? error.body.message : JSON.stringify(error);
            this.dispatchEvent(ErrorEvent);
        })
        .finally(() => {
            this.isLoading = false;
        }); 
    }

    validateInput(){
        const allValid = [
            ...this.template.querySelectorAll('lightning-input'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);
        return allValid;
    }



   async handleModalClick(event) {
    let index = event.currentTarget.dataset.index;
    let value = event.currentTarget.dataset.value;
    console.log('Modal Clicked - Index:', index, 'Value:', value);

    
    try {
        const result = await searchProducts.open({
            size: 'large',
            description: 'Search Product Modal',
            label: "Search Product",
            priceBook2Id: this.priceBook2Id,
            index: index,
            content: value
        });
        console.log('Result ', result);

        if (result && result.productId) {
            // Update the product in the records array
            this.records[index].Product2Id = result.productId;
            this.records[index].Product2 = { Name: result.productName };
            this.records[index].lookupValue = result.productName;
            console.log(`Product selected: ${result.productName} (${result.productId}) for index ${index}`);
        }
    } catch (error) {
        console.error('Error opening modal:', error);
    }
}

    handleLookupChange(event){
        event.preventDefault();
        let index = event.currentTarget.dataset.index;
        let value = event.currentTarget.value;
        this.records[index]['lookupValue'] = value;

    }
}