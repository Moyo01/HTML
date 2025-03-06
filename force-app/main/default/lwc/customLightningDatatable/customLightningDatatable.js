
import LightningDatatable from 'lightning/datatable';

import imageTemplate from './templates/image.html';
import picklistTemplate from './templates/picklist.html';

export default class customLightningDatatable extends LightningDatatable {

    static customTypes ={

        image: {  
            template: imageTemplate, 
            typeAttributes: ['height', 'width', 'alt']  
        },

        picklist: {
            template: picklistTemplate,
            typeAttributes: ['name', 'label', 'placeholder', 'options', 'index', 'variant']
        },
       
        
};
handleChange(event){
    event.preventDefault();
    let selectValue = new CustomEvent('select' ,{
        detail:{
             value: event.target.value
    }, 
    bubbles: true,
    composed: true

    }); 
    this.dispatchEvent(selectValue);


}
}
