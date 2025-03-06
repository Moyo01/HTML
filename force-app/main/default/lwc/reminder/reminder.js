import { LightningElement, track, wire, api  } from 'lwc';
import fetchToDoList from '@salesforce/apex/reminderService.fetchToDoList';
import { NavigationMixin } from 'lightning/navigation';


export default class Reminder extends  NavigationMixin(LightningElement) {

    @track toDoList = [] ;
    @track errors;
    @track selectedRecord;
    @track selectedEditRecord;
    editModal=false;
    showModal=false;
   

    @wire(fetchToDoList)

    wiredFetchData({ error, data }) {
        if (data) {
            this.toDoList = data;
            let currentDate = new Date();
            this.toDoList = data.map(toDo => {
                let activityDate = toDo.ActivityDate;
                let activityDateConverted = new Date(activityDate);
                return {
                    ...toDo,
                headingStyle : currentDate > activityDateConverted ? 'color:red' : 'green'
                }
            });
        }
        if(error){
            this.errors = error;
        }
    }


    handleClick(){
        this.showModal=true;
       
    }

    handleSuccess(){
              this.editModal=false;
              this.showModal=false;
              this.selectedRecord = undefined;
              location.reload(true);
    }

    handleCancel(){
        this.showModal=false;
        this.selectedRecord = undefined;
        this.editModal=false;
    }

    handleRecordPage(event){
        event.preventDefault();
        let recordId = event.currentTarget.dataset.recordId;
           this.selectedRecord = this.toDoList.find((todo) => {
            return recordId === todo.Id;
            
        });
    }

    handleRecordEditPage(event){
            event.preventDefault();
            this.editModal=true;
            let recordId = event.currentTarget.dataset.recordId;

            this.selectedEditRecord = this.toDoList.find((todo) => {
                return recordId === todo.Id;

                console.log('Selected Record for Editing:', JSON.stringify(this.selectedEditRecord));
                
            });
                /*
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        objectApiName: "Task",
                        recordId: recordId,
                        actionName: "edit"
                    }
                });
                */
            }
    }
