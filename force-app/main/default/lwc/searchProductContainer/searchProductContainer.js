import { LightningElement } from 'lwc';
import searchProductModal from 'c/searchProducts';
export default class SearchProductContainer extends LightningElement {

    async handleClick() {
        const result = await searchProductModal.open({
            size: 'large',
            desciption: 'Search Product Modal',
            label: "Seach Product",
            priceBook2Id: '01sak00000AjZNFAA3',
            index: '0',
            content: 'Simple Content from Parent'
        });
        console.log('Result ', result);
    }
    
}