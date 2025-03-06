import { api, LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord, getRecord, getFieldValue } from 'lightning/uiRecordApi';

import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import ID_FIELD from '@salesforce/schema/Contact.Id';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

const FIELDS = [FIRSTNAME_FIELD, LASTNAME_FIELD, EMAIL_FIELD];

export default class UpdateRecord extends LightningElement {
    @api recordId;
    contactRecord;
    fieldValue = {};
    

    // Wire to fetch record data
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ error, data }) {
        if (data) {
            console.log('Fetched data:', data);
            this.contactRecord = data;
            this.fieldValue = { 
                firstName: getFieldValue(data, FIRSTNAME_FIELD),
                 lastName: getFieldValue(data, LASTNAME_FIELD),
                 email: getFieldValue(data, EMAIL_FIELD),
            };
        } else if (error) {
            console.error('Error fetching record:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error fetching record',
                    message: error.body.message,
                    variant: 'error',
                })
            );
        }
    }

    get firstName() {
        return getFieldValue(this.contactRecord, FIRSTNAME_FIELD);
    }

    // Getter for lastName (read-only)
    get lastName() {
        return getFieldValue(this.contactRecord, LASTNAME_FIELD);
    }

    // Getter for email (read-only)
    get email() {
        return getFieldValue(this.contactRecord, EMAIL_FIELD);
    }

    // Handle change in input values
    handleChange(event) {
        event.preventDefault();
        let name = event.target.name;
        let value = event.target.value;
        this.fieldValue[name] = value;
        
    }

    // Handle update
    handleUpdate() {
        console.log('Updating contact with fields:', this.firstName, this.lastName, this.email);
        const fields = {};
        fields[FIRSTNAME_FIELD.fieldApiName] = this.fieldValue.firstName;
        fields[LASTNAME_FIELD.fieldApiName] = this.fieldValue.lastName;
        fields[EMAIL_FIELD.fieldApiName] = this.fieldValue.email;
      fields[ID_FIELD.fieldApiName] = this.recordId;
        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                console.log('Contact updated successfully');
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact updated successfully',
                        variant: 'success',
                    })
                );
            })
            .catch((error) => {
                console.error('Error updating record:', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.body.message,
                        variant: 'error',
                    })
                );
            });
    }
}
