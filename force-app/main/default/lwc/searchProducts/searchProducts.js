import { LightningElement, track, api } from 'lwc';
import lightningModal from 'lightning/modal';
import searchProducts from '@salesforce/apex/SearchProductService.searchProducts';

const columns = [
    {
        label: 'Name',
        fieldName: 'recordUrl',
        type: 'url',
        typeAttributes: {
            label: { fieldName: 'Name' },
            target: '_blank'
        }
    },
    { label: 'Product Code', fieldName: 'ProductCode' },
    { label: 'Family', fieldName: 'Family' }
];

export default class SearchProducts extends LightningElement {
    @track records = [];
    @track error;
    @track columnList = columns;
    isSpinner = false;
    showModal = false;  
    searchKeyword = '';
    @api PriceBook2Id;

    async handleClick() {
        console.log("Modal Opened with PriceBook:", this.priceBook2Id, "Index:", this.index);
        this.showModal = true;

        const result = await searchProducts.open({
            size: 'large',
            description: 'Search Product Modal',
            label: "Search Product",
            priceBook2Id: this.priceBook2Id,
            index: this.index,
            content: 'Simple Content from Parent'
        });

        console.log('Modal Result:', result);
        this.records = []; 
    }

    closeModal() {
        this.close('User closed modal');
    }

    
    handleCancel() {
        this.showModal = false;
        this.close('cancel');
    }

    
    handleSearchChange(event) {
        this.searchKeyword = event.target.value;
        this.handleSearch(); // Fetch products immediately
    }

   
    handleSearch() {
        if (!this.searchKeyword.trim()) {
            this.records = [];
            return;
        }

        this.isSpinner = true;
        const baseUrl = window.location.origin;

        searchProducts({ searchKey: this.searchKeyword })
            .then((result) => {
                this.records = result.length > 0
                    ? result.map(record => ({
                        ...record,
                        recordUrl: `${baseUrl}/lightning/r/Product2/${record.Id}/view`
                    }))
                    : [];
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

   

    
    handleRowAction(event) {
        const selectedRows = event.detail.selectedRows;
        if (selectedRows.length > 0) {
            const selectedProduct = {
                productId: selectedRows[0].Id,
                productName: selectedRows[0].Name
            };

            // Fire event to send product selection to parent
            const selectedEvent = new CustomEvent('productselected', {
                detail: selectedProduct
            });
            this.dispatchEvent(selectedEvent);

            this.showModal = false; // Close modal after selection
        }
    }
}
