import LightningDatatable from 'lightning/datatable';
import picklistTemplate from './templates/picklist.html';
import imagePicklist from './templates/image.html';

export default class DatatableChild extends LightningDatatable {

 static customTypes = {
    picklist: {
        template: picklistTemplate,
        typeAttributes: [ 'name', 'label', 'placeholder', 'options', 'value',  'variant', 'index'  ]
    },

    image: {
        template: imagePicklist,
        typeAttributes: [ 'height', 'width', 'alt'  ]
    },
 };

 handleChange(event){
    event.preventDefault();
    let value = new CustomEvent('selectPicklist', {
        detail: {
           value: event.target.value
        },
        bubbles: true,
        composed: true
 });
 this.dispatchEvent(value);
}
}
