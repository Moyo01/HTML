import { api, LightningElement, track, wire } from 'lwc';
import fetchPicklistValues from '@salesforce/apex/reminderService.fetchPicklistValues';
import createToDoItem from '@salesforce/apex/reminderService.createToDoItem';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';

export default class CreateTaskComponent extends LightningElement {


    isLoading = false;
    @track statusOptions = [];
    @track priorityOptions = [];

    @api recordToCreate = {
        "Subject": "",
        "ActivityDate": null,
        "Status": "",
        "Priority": "",
        "Description": "",
        "WhatId": ""  // Ensure this is set if required
    };

    @api recordId;

    connectedCallback() {
        if (this.recordId) {
            this.recordToCreate = { ...this.recordToCreate, WhatId: this.recordId };
        }
    }

    
    
   // @wire(CurrentPageReference) pageref;

   /*
    connectedCallback() {
        if (this.pageref && this.pageref.state.recordId) {
            this.recordToCreate.WhatId = this.pageref.state.recordId;
        } else {
            console.error('No recordId found in PageRef');
        }
    }
*/
    

    @wire(fetchPicklistValues, {
         objectApiName: "Task",
        fieldApiName: "Status"
         })


    WiredStatus({ data, error }) {
        if (data) {
            this.statusOptions = data;
        }
        if (error) {
            console.error(error);
        }
    }

    @wire(fetchPicklistValues, { 
       objectApiName: "Task",
        fieldApiName: "Priority"
     })

    WiredPriority({ data, error }) {
        if (data) {
            this.priorityOptions = data;
        }
        if (error) {
            console.error(error);
        }
    }

    handleChange(event) {
        event.preventDefault();
        let name = event.target.name;
        let value = event.target.value;
        let existingValues = { ... this.recordToCreate};
        existingValues[name] = value;
        this.recordToCreate = JSON.parse(JSON.stringify(existingValues));
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.validateInput() === false) {
            return;
        }

        console.log('Record to Create:', JSON.stringify(this.recordToCreate)); 

        this.isLoading = true;
        createToDoItem({
            taskString: JSON.stringify(this.recordToCreate)
        })
        .then((result) => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Record Created',
                variant: 'success',
            }));

           this.dispatchEvent(new CustomEvent('success'));

           
        
    })
        
        .catch(error => {
            console.error('Error:', error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: JSON.stringify(error),
                variant: 'error',
            }));

        })
        .finally(() => {
            this.isLoading = false;
        });
    }

    validateInput() {
        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        const allValidComboBox = [...this.template.querySelectorAll('lightning-combobox')]
            .reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);

        return allValid && allValidComboBox;
    }


    /*
    navigateToTaskHomePage() {
        console.log('Navigating to Task Home Page');
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Task',
                actionName: 'home'
            }
        });
        
    }
*/

}
