import { LightningElement, track, wire } from 'lwc';
import getAccount from '@salesforce/apex/AccountController.getAccount';


export default class LightningMapComp extends LightningElement {

    @track mapMarkers;
    zoomLevel = 15;
    listView= 'visible';
    error;

    @wire(getAccount)
        wiredList({data, error }){
        if(data){
           
            data.forEach(Account => {
                let Mapobj = {
                    location: {
                        City: Account.ShippingCity,
                        Country: Account.ShippingCountry,
                        PostalCode: Account.ShippingPostalCode,
                        State: Account.ShippingState,
                        Street: Account.ShippingStreet,
                    },
        
                    value: Account.Name,
                    icon: 'standard:account',
                    title: Account.Name,
                    description: Account.description,

            }
            if(!this.mapMarkers){
                this.mapMarkers = [];
            }
            this.mapMarkers.push(Mapobj);
        });
             window.console.log(' this.mapMarkers /n ', this.mapMarkers);  

        } else if(error){
            this.error= error;
            this.mapMarkers= undefined;
        }
    }
    }
