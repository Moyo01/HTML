import { LightningElement, api, wire, track } from 'lwc';
import acclist from '@salesforce/apex/AccountController.acclist';
import { getPicklistValues, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi'
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import ACCOUNT_INDUSTRY from '@salesforce/schema/Account.Industry';


const DEFAULT_RECORD_TYPE_ID = '012000000000000AAA';


export default class PicklistChild extends LightningElement {


    @api  objectApiName='Account';
    @api fieldApiName = 'Industry';
    error;
    value;
    @api recordTypeId = DEFAULT_RECORD_TYPE_ID;
    @api name;
    @api label;
    @api options = [];
    @api value;
    @api placeholder;
    @api variant;
    @api index;
    @track picklistValues = [];

    @wire(getPicklistValuesByRecordType, {
        recordTypeId: '$recordTypeId', 
        objectApiName: '$objectApiName'  
   })
 
  picklistHandler({ data, error }) {
      if (data) {
          console.log(' picklist values ', data);
          if(data.picklistFieldValues && data.picklistFieldValues[this.fieldApiName]){
              let picklistValues = data.picklistFieldValues[this.fieldApiName];
              this.options = picklistValues.values;
      }else {
          this.error = error;
          
      }
  }
}

get options() {
    return this.picklistValues;

}   

  set options(options){
   this.picklistValues = options;
}

    handleChange(event){
        event.preventDefault();
        let value = event.target.value;
        const picklist = new CustomEvent('selectPicklist', {
            detail: {
                value: value,
                index: this.index,
                fieldName: this.name
            },
            bubbles: true,
            composed: true,
            cancelable: true
        });
        this.dispatchEvent(picklist);
    }

}