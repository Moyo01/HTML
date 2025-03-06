import { LightningElement } from 'lwc';

export default class MyLightningPage extends LightningElement {
    // Handle Account selection
    handleAccountSelect(event) {
        const selectedAccountId = event.detail;
        console.log('Selected Account Id:', selectedAccountId);
        // Add your logic to handle the selected Account
    }

    // Handle Case selection
    handleCaseSelect(event) {
        const selectedCaseId = event.detail;
        console.log('Selected Case Id:', selectedCaseId);
        // Add your logic to handle the selected Case
    }
}