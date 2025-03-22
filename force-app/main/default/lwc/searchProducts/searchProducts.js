import { track, api } from 'lwc';
import lightningModal from 'lightning/modal';

import searchProducts from '@salesforce/apex/SearchProductService.searchProducts';

const columns = [
    {
        label: 'Name',
        fieldName: 'Name',
        type: 'link',
        typeAttributes:  {
            recordId: {
                fieldName: 'Id'
            },
            recordName: {
                fieldName: 'Name'
            }
        }
    },
    { label: 'Product Code', fieldName: 'ProductCode' },
    { label: 'Family', fieldName: 'Family' },
    { label: 'Description', fieldName: 'Description' },
    { label: 'Active ?', fieldName: 'IsActive' }
];


export default class SearchProducts extends lightningModal {
   
    @track records ;
    @track error;
    @track columnList = columns;

    isSpinner = false;
    showModal = false;  
    @api priceBook2Id;
    @api content;
    @api index;


    handleCancel() {
        this.close('cancel');
    }


    handleClick() {
        this.close('okay');
    }

    
    handleChange(event) {
        event.preventDefault();
        let searchKeyword = event.target.value;
        this.handleClick(searchKeyword); // Fetch products immediately
    }

   
    handleClick(searchKeyword){
        this.isSpinner = true;
      //  const baseUrl = window.location.origin;
    
        searchProducts({ 
            searchKey: searchKeyword, 
            priceBook2Id: this.priceBook2Id
        })
            .then((result) => {
                this.records = result;
                this.records = result.map(record => {
                        return {
                            ...record,
                            Family: record.Family ? record.Family.Name : '',
                            IsActive: record.IsActive ? record.IsActive : '',
                            Description: record.Description ? record.Description : '',
                            ProductCode: record.ProductCode ? record.ProductCode : '',
                            Name: record.Name ? record.Name : '',
                         //   recordUrl: `${baseUrl}/lightning/r/Product2/${record.Id}/view`
                        };
                    });
            })
            .catch((error) => {
                this.error = error;
                console.error("Error fetching products: ", error);
                this.records = [];
            })
            .finally(() => {
                this.isSpinner = false;
            });
    }

    connectedCallback() {
        if(this.content){
            this.handleClick(this.content);
        }
    }
    

    handleLinkClick(event) {
    event.preventDefault();
    console.log('Link clicked', event.detail);
    let details = event.detail;
    let clonedDetails = JSON.parse(JSON.stringify(details));
    clonedDetails.index = this.index;
    this.close(JSON.stringify(clonedDetails));
}
}
