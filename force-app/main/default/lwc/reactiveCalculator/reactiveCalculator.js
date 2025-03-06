import { LightningElement } from 'lwc';

export default class ReactiveCalculator extends LightningElement {

    numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // Numbers 0-9
    clickedNumbers = ''; // To track the input numbers
    displayField = ''; // Display the entered numbers and operations
    result = ''; // To show the final result
    number1 = null; // Store the first number
    number2 = null; // Store the second number
    currentOperation = ''; // Store the operation (+ or -)
    decimalUsed = false; // To prevent multiple decimals in a number

    // Handle number button click
    handleNumberClick(event) {
        const clickedNumber = event.target.label; // Get the clicked number
        this.clickedNumbers += clickedNumber; // Append the number
        this.displayField = this.clickedNumbers; // Update the display
    }

    // Handle decimal point button click
    handleDecimal() {
        if (!this.decimalUsed) { // Allow decimal only once per number
            this.clickedNumbers += '.'; // Add the decimal
            this.displayField = this.clickedNumbers; // Update display
            this.decimalUsed = true; // Mark decimal as used
        }
    }

    // Handle delete button click
    handleDelete() {
        if (this.clickedNumbers.length > 0) {
            this.clickedNumbers = this.clickedNumbers.slice(0, -1); // Remove last character
            this.displayField = this.clickedNumbers; // Update display

            // Adjust number1 and number2 if delete affects them
            if (this.number2 !== null) {
                this.number2 = parseFloat(this.clickedNumbers); // Update second number
            } else if (this.number1 !== null) {
                this.number1 = parseFloat(this.clickedNumbers); // Update first number
            }
        }
    }

    // Handle addition button click
    handleAdd() {
        if (this.clickedNumbers !== '') {
            if (this.number1 === null) {
                this.number1 = parseFloat(this.clickedNumbers); // Store first number
            } else {
                this.number2 = parseFloat(this.clickedNumbers); // Store second number
            }
            this.currentOperation = '+'; // Set operation to addition
            this.clickedNumbers = ''; // Clear input for next number
            this.displayField = `${this.number1} +`; // Show the first number with "+"
            this.decimalUsed = false; // Reset decimal flag
        }
    }

    // Handle subtraction button click
    handleSubtract() {
        if (this.clickedNumbers !== '') {
            if (this.number1 === null) {
                this.number1 = parseFloat(this.clickedNumbers); // Store first number
            } else {
                this.number2 = parseFloat(this.clickedNumbers); // Store second number
            }
            this.currentOperation = '-'; // Set operation to subtraction
            this.clickedNumbers = ''; // Clear input for next number
            this.displayField = `${this.number1} -`; // Show the first number with "-"
            this.decimalUsed = false; // Reset decimal flag
        }
    }

    // Handle equal button click (perform calculation)
    handleEqual() {
        if (this.number1 !== null && this.clickedNumbers !== '') {
            this.number2 = parseFloat(this.clickedNumbers); // Store second number
            let calculation;

            // Perform the calculation based on the operation
            if (this.currentOperation === '+') {
                calculation = this.number1 + this.number2;
            } else if (this.currentOperation === '-') {
                calculation = this.number1 - this.number2;
            }

            // Show result
            this.result = calculation.toString();
            this.displayField = `${this.number1} ${this.currentOperation} ${this.number2} = ${this.result}`;

            // Reset for next calculation
            this.number1 = null;
            this.number2 = null;
            this.clickedNumbers = '';
            this.decimalUsed = false; // Reset decimal flag
        } else {
            this.result = 'Complete the operation.'; // If operation is incomplete
        }
    }
}