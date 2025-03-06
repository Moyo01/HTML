import { LightningElement, wire } from 'lwc';
import getContacts from '@salesforce/apex/AccountController.getContacts';


const actions = 
[
    { label: 'Show Contacts', name:'show_contacts' },
    { label: 'Delete Contacts', name:'delete_contacts' }
];


const columns = [
    { label: 'FirstName', fieldName: 'FirstName' },
    { label: 'LastName', fieldName: 'LastName', type: 'text' },
    { label: 'Email', fieldName: 'Email', type: 'text' },
    { label: 'Phone', fieldName: 'Phone'},
    { label: 'Account Name', fieldName: 'ACCOUNT_NAME', type: 'text' },
   // { label: 'Account Phone', fieldName: 'ACCOUNT_PHONE', type: 'text' },


    {label : 'Actions', type: 'action' , typeAttributes:{ rowActions: 
        
        [ 
            { label:'Show Contacts', value: 'show_contacts',  name:'show_contacts'},
            { label:'Delete Contacts', value: 'delete_contacts',  name:'delete_contacts'}
           ]
            
            }
    }
    
];



export default class DatatableComp extends LightningElement {

    columndata;
    error;
    columns= columns;


    handleRowAction(event){
        const action = event.detail.action;
        const row = event.detail.row;
        switch(action.name){
            case 'show_contacts':
                alert ('Show Contacts  :' + row.Id);
                break;
            case 'delete_contacts':
                alert ('Delete Contacts :' + row.Id); 
                this.handleDelete(row.Id);
                break;
        }
    }

    handleDelete(recordId){
        const row = event.detail.row;
        alert ('Delete Contacts :' + recordId);
    }

    @wire(getContacts)
    wiredList( {data, error } ){
            if(data){
                let parseData = JSON.parse(JSON.stringify(data));

                parseData.forEach(Contact => {
                    if(Contact.AccountId){
                        Contact.ACCOUNT_NAME = Contact.Account.Name;
                        Contact.ACCOUNT_PHONE = Contact.Account.Phone;
                    }
                });
                this.columndata= parseData;
                this.error= undefined;
            } else if(error){
                this.error = error;
                this.columndata= undefined;
            }
        }
    }

