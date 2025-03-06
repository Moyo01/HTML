import { LightningElement } from 'lwc';

export default class Calculator extends LightningElement {
    number1 = 0;
    number2 = 0;
    result = '';

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        if (name === 'number1') {
            this.number1 = value;
        } else if (name === 'number2') {
            this.number2 = value;
        }
    }

    dosum() {
        this.result = parseInt(this.number1 || 0) + parseInt(this.number2 || 0);
    }

    dosubstract() {
        this.result = parseInt(this.number1 || 0) - parseInt(this.number2 || 0);
    }
}
