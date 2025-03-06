import { LightningElement, track, api, wire } from 'lwc';
import acclist from '@salesforce/apex/AccountController.acclist';


const columns = [
    { label: 'Name', fieldName: 'Name',  },
    { label: 'Phone', fieldName: 'Phone', type: 'phone', editable: true },
    
    {
        label: 'Industry', fieldName: 'Industry', type: 'picklist', wrapText: true, typeAttributes: {
            name: 'Industry',
            label: 'Industry',
            placeholder: 'Select Industry',
            options: [
                { label: 'Education', value: 'Education' },
                { label: 'Technology', value: 'Technology' },
                { label: 'Banking', value: 'Banking' },
                { label: 'Chemical', value: 'Chemical' },
                { label: 'Aparel', value: 'Aparel' },
                { label: 'IT', value: 'IT' },
            ],
            variant: 'label-hidden'
        }
    }, 
   
    { label: 'Type', fieldName: 'Type' },

    { label: 'Logo', fieldName: 'IMAGE_URL', type: 'image', typeAttributes: { height: 50, width: 50, alt: 'Learning Logo' } },
    {
        label: 'Parent',
        fieldName: 'Parent',
        type: 'Lookup',
        typeAttributes: {
            recordId: { fieldName: 'ParentId' },
            recordName: { fieldName: 'Name' },
            objectName: 'Account',
            iconName: 'standard:account',
            label: 'Parent',
            placeholder: 'Select Parent Account here',
            parentApiName: 'ParentId',
            fields: [['Name']],
            displayFields: 'Name, Rating, AccountNumber'
        }
    }
];

export default class DatatableExtended extends LightningElement {
    @track records ;
    @track errors;
    @track columnList = columns;
    
    @wire(acclist)
    wiredAccounts({data, error}){
        if(data){
             console.log(' picklist values ', data);
            this.records = data.map(item => {
                return {
                    ...item,
                    IMAGE_URL: 'https://www.pantherschools.com/wp-content/uploads/2022/02/cropped-logoblack.png',
                    ICON_NAME: 'standard:contact',   
                }
            })

        } if(error) {
            this.errors = error;
            this.records = undefined;
        }
    }
    
    handleSelect(event) {
        event.preventDefault();
        console.log('Industry Changed!');
    }

   
}
