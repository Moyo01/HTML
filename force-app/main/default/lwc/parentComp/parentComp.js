import { LightningElement } from 'lwc';

export default class ParentComp extends LightningElement {
    handleSempleEvent(event) { // Accept event parameter
        const message = event.detail.message;
        alert('Message is: ' + message); // Corrected alert syntax
    }
}
