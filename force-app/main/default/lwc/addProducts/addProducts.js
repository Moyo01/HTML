import { LightningElement, api, track, wire } from 'lwc';
import listLineItems from '@salesforce/apex/addProducts.queryLineitemRecords';
import getPriceBook from '@salesforce/apex/addProducts.fetchPriceBookId';
import { deleteRecord } from 'lightning/uiRecordApi';
import getPriceBookEntries from '@salesforce/apex/addProducts.getPriceBookEntries';
import submitProducts from '@salesforce/apex/addProducts.submitProducts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import refreshLineItems from '@salesforce/apex/addProducts.listLineItem';
import searchProductModal from 'c/searchProducts';

export default class AddProducts extends LightningElement {

    @api recordId;
    @api objectApiName;
    priceBookQuery = '';
    priceBookId; // Keep this for backward compatibility
    priceBook2Id;
    isLoading = false;
    showModal = false;
    priceBookEntryMap = {};
    errorMessage;

    objectApiNameMap = {
        'Quote': 'QuoteId',
        'Order': 'OrderId',
        'Opportunity': 'OpportunityId'
    }

    fields = ["Name", "ProductCode", "Family"];
    displayFields = 'Name, ProductCode, Family';

    query = '';

    @track records = [];
    @track error;
    index;
    lookupValue;

    showOpportunityHeader = false;
    showOrderHeader = false;
    showQuoteHeader = false;

    @wire(getPriceBookEntries, {
        priceBook2Id: '$priceBook2Id'
    })
    wiredPriceBookEntries({ error, data }) {
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
        this.isLoading = true;
        this.priceBookQuery = `SELECT Pricebook2Id FROM ${this.objectApiName} WHERE Id = '${this.recordId}' LIMIT 1`;

        if (this.objectApiName === 'Opportunity') {
            this.query = `SELECT Id, OpportunityId, SortOrder, PricebookEntryId, Product2Id, ProductCode, 
                Name, Quantity, TotalPrice, UnitPrice, ListPrice, ServiceDate, Description,
                Product2.Name
                FROM OpportunityLineItem
                WHERE OpportunityId = '${this.recordId}'
            `;
            this.showOpportunityHeader = true;
        } else if (this.objectApiName === 'Order') {
            this.query = `SELECT Id, Product2Id, OrderId, PricebookEntryId, 
                Quantity, UnitPrice, ListPrice, 
                Product2.Name,
                TotalPrice, ServiceDate, Description FROM OrderItem
                WHERE OrderId = '${this.recordId}'
            `;
            this.showOrderHeader = true;
        } else if (this.objectApiName === 'Quote') {
            this.query = `SELECT Id, LineNumber, QuoteId, 
                PricebookEntryId, Quantity, UnitPrice, 
                Product2.Name,
                Description, ServiceDate, Product2Id, ListPrice, TotalPrice FROM QuoteLineItem
                WHERE QuoteId = '${this.recordId}'`;
            this.showQuoteHeader = true;
        }
        console.log('Query built:', this.query);
    }

    @wire(getPriceBook, {
        query: '$priceBookQuery'
    })
    wiredPriceBook({ error, data }) {
        if (data) {
            console.log('PriceBook Record', data);
            if (data.length && data.length > 0) {
                // Important: Check the actual field name from the query result
                // It could be Pricebook2Id or PriceBook2Id depending on the API
                this.priceBookId = data[0].Pricebook2Id;
                this.priceBook2Id = data[0].Pricebook2Id;
                console.log('PriceBook2Id set to:', this.priceBook2Id);
                
                // Only show modal if price book is not set
                if (this.priceBook2Id) {
                    this.showModal = false;
                } else {
                    this.showModal = true;
                }
                this.error = undefined;
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

    @wire(listLineItems, {
        query: '$query'
    })
    wiredLineItems({ error, data }) {
        if (data) {
            console.log('wiredLineItems results:', data.length);
            this.records = JSON.parse(JSON.stringify(data));
        } else if (error) {
            console.error('Error in wiredLineItems:', error);
            this.error = error;
        }
        this.isLoading = false;
        this.addRow();
    }

    addRow() {
        this.records.push({
            Quantity: null,
            Description: '',
            UnitPrice: null,
            ServiceDate: null
        });
        console.log('Added new row, total rows:', this.records.length);
    }

    handleLookup(event) {
        let detail = event.detail;
        this.records[detail.data.index][detail.data.parentAPIName] = detail.data.recordId;
     //   console.log(`Set ${detail.data.parentAPIName} to ${detail.data.recordId} at index ${detail.data.index}`);
    }

    handleDelete(event) {
        // Get the index from the data attribute
        const indexToDelete = event.target.dataset.index;
        const recordId = event.target.dataset.recordId;
        // Delete the record
        if (recordId) {
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

    handleDetailPage(event) {
        event.preventDefault();
        let recordId = event.target.dataset.recordId;
        if (recordId) {
            const recordUrl = `https://${location.host}/lightning/r/Product2/${recordId}/view`;
            location.href = recordUrl;
        }
    }

    handleChange(event) {
        event.preventDefault();
        let index = event.currentTarget.dataset.index;
        let name = event.currentTarget.name;
        let value = event.currentTarget.value;
        this.records[index][name] = value;
    }

    handleCancel() {
        this.showModal = false;
    }

    handleSave(event) {
        event.preventDefault();
        this.showModal = false;
        // Make sure we're using the correct property from the event detail
        this.priceBook2Id = event.detail.priceBook2Id;
        console.log('PriceBook2Id set from modal:', this.priceBook2Id);
    }

    handleChoosePriceBook() {
        this.showModal = true;
    }

    submitRecords(event) {
        event.preventDefault();
        this.errorMessage = '';
        
        let allValid = this.validateInput();
        if (!allValid) {
            console.log('Input validation failed');
            return;
        }

        // Product validation
        let hasInvalidProducts = false;
        this.records.forEach((line, index) => {
            if (!line.Id && !line.PricebookEntryId) {
                hasInvalidProducts = true;
                console.log(`Missing PricebookEntryId at index ${index}`);
            }
        });
        
        if (hasInvalidProducts) {
            this.errorMessage = 'Please select the product for all the line items!';
            console.log('Product validation failed:', this.errorMessage);
            return;
        }

        // Prepare records for upsert
        this.isLoading = true;
        let recordsToSubmit = JSON.parse(JSON.stringify(this.records)); // Deep copy

        recordsToSubmit.forEach(line => {
            if (!line.Id) {
                let parentApiName = this.objectApiNameMap[this.objectApiName];
                line[parentApiName] = this.recordId;
                
                // Keep PricebookEntryId but remove Product2Id to avoid conflicts
                line.Product2Id = undefined;
            }
        });

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
            return refreshLineItems({
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

    validateInput() {
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

        const result = await searchProductModal.open({
            size: 'large',
            description: 'Search Product Modal',
            label: "Search Product",
            priceBook2Id: this.priceBook2Id,
            index: index,
            content: value
        });
        console.log('Result ', result);

        if (result && result !== 'cancel') {
            let selectedDetails = JSON.parse(result);
            this.records[selectedDetails.index]['PricebookEntryId'] = selectedDetails.recordId;
            this.records[selectedDetails.index]['Product2Id'] = selectedDetails.product2Id; 
            this.records[selectedDetails.index]['SELECTED_Product_Name'] = selectedDetails.recordName;
        } 
    }

    handleLookupChange(event) {
        event.preventDefault();
        let index = event.currentTarget.dataset.index;
        let value = event.currentTarget.value;
        this.records[index]['lookupValue'] = value;
    }

    handleRemoveOnly(event) {
        let index = event.currentTarget.dataset.index;
        this.records[index]['Product2Id'] = undefined;
        this.records[index]['SELECTED_Product_Name'] = undefined;
    }
}