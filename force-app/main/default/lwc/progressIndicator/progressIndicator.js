import { LightningElement, api } from 'lwc';

export default class ProgressIndicator extends LightningElement {

    @api currentStep;
    
    @api stepValues = [
        {label: 'Account', value: 'Account'},
        {label: 'Contact', value: 'Contact'},
        {label: 'Opportunity', value: 'Opportunity'},
        {label: 'Product', value: 'Product'}
    ]
}