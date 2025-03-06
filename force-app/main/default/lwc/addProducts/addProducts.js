import { LightningElement, api, track, wire } from 'lwc';
import LineItem from '@salesforce/apex/addProducts.queryLineitemRecords';

export default class AddProducts extends LightningElement {

    @api recordId;
    @api objectApiName;
    isLoading = true;

    fields=[ "Name" , "ProductCode" , "Family"];
    displayFields = 'Name, ProductCode, Family';

    query= '';

    @track records = [];
    @track error;

    connectedCallback() {
        //code to fetch the records
        if(this.objectApiName === 'Opportunity'){
            this.query = `SELECT Id, Name, Description, OpportunityId, Quantity, 
                        ListPrice, ServiceDate, Product2Id, ProductCode, UnitPrice
                        FROM OpportunityLineItem
                        WHERE OpportunityId = '${this.recordId}'`;
        } else if (this.objectApiName === 'Order') {
            // Query OrderItems related to this Order
            this.query = `SELECT Id, TotalPrice, ListPrice, UnitPrice, Quantity, EndDate, PricebookEntryId,
                        ServiceDate, OrderId, Description, Product2Id, ProductCode
                        FROM OrderItem
                        WHERE OrderId = '${this.recordId}'`;      
         }
        console.log(this.query);
    this.addRow();
}
@wire(LineItem, {
    query: '$query'
})

wiredLineItem(result){
    if(result.data){
        console.log(result.data);
        this.records = result.data ;
        this.error = undefined;
        
    } else if(result.error){
        console.log(result.error);
        this.error = result.error;
    }
  this.isLoading = false;
}

addRow(){
    this.records.push({
        productName: '',
        Decription: '',
        Quantity: '',
        UnitPrice: '',
        ServiceDate:''
        
    })
}

handleLookup(event){
    event.preventDefault();
    this.value = event.target.value;
}

handleDelete(event) {
    // Get the index from the data attribute
    const indexToDelete = event.target.dataset.index;
    
    // Remove the row at the specified index
    this.records.splice(indexToDelete, 1);
}
}
