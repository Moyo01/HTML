import { api, LightningElement } from 'lwc';

export default class Son2 extends LightningElement {
@api record;
@api iconname;

handleSelect(event){
    const selectEvent = new CustomEvent('select',{
        detail : this.record.Id
    });
    this.dispatchEvent(selectEvent);
}
}