import { api, LightningElement } from 'lwc';

export default class RecordList extends LightningElement {
    @api record;  // Receive a single record
    @api iconname; // Icon name for display

    handleSelect() {
        const selectEvent = new CustomEvent(
            'select', 
            {
            detail: this.record.Id
        });

        this.dispatchEvent(selectEvent);
    }
}
