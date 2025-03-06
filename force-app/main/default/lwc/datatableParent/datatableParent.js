import { LightningElement, track, wire } from 'lwc';
import acclist from '@salesforce/apex/AccountController.acclist';

const columns = [

    { label: 'Name', fieldName: 'Name' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true },
    
    {
        label: 'Industry', fieldName: 'Industry', type: 'picklist', wrapText: true, typeAttributes: {
            options: [],
            placeholder:'Select Industry',
            variant: 'label-hidden'
        }},
    
        { label: 'Type', fieldName: 'Type' }

];


export default class DatatableParent extends LightningElement {

 @track records;
 @track errors;
 @track columnList = columns;

 
        @wire(acclist)
        wiredAccount({ data, error }){
            if(data){
                this.records = data;
                this.errors = undefined;
            } else if(error) {
                this.errors = error;
                this.records = undefined;
            }
        }
    
    
    handlepicklistChange(event){
        event.preventDefault();
    }
    
}