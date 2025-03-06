import { LightningElement } from 'lwc';

export default class AccountWithContactsAndOpportunity extends LightningElement {

    currentStep='Account';
    showContact= false;
    showAccount=true;
    showOpportunity=false;
    showProduct=false;

    stepValues= [
        {label: 'Account', value: 'Account'},
        {label: 'Contact', value: 'Contact'},
        {label:'Opportunity', value: 'Opportunity'},
        {label:'Products', value: 'Products'}
    ]
    handleNext(event){
        event.preventDefault();
        this.prepareCurrentStep(event);
    }

    handlePrevious(){
        event.preventDefault();
        this.prepareCurrentStep(event)
    }

    prepareCurrentStep(event){
        event.preventDefault();
        this.showAccount = event.detail.showAccount;
        this.showContact = event.detail.showContact;
        this.showOpportunity = event.detail.showOpportunity;
        this.showProduct = event.detail.showProduct;

        if(this.showAccount){
            this.currentStep = 'Account';
        }else if( this.showContact){
            this.currentStep = 'Contact';
        } else if(this.showOpportunity){
            this.currentStep = 'Opportunity';
        } else {
            this.currentStep = 'Products';
        }
    }
}