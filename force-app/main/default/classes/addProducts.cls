public with sharing class addProducts {
    

    @AuraEnabled(cacheable=true)
    public static List<sObject> getPriceBookEntries(string PriceBook2Id){
        try {
            return [SELECT Id, Name, UnitPrice , IsActive, Product2Id, Pricebook2Id
                    FROM PricebookEntry 
                    WHERE Pricebook2Id =: PriceBook2Id 
                    AND IsActive = True];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void submitProducts(String objectApiName, String records){
        try {
            if(objectApiName == 'Opportunity'){
                List<OpportunityLineItem> lineItems = (List<OpportunityLineItem>)JSON.deserialize(records, List<OpportunityLineItem>.class);
                upsert lineItems;
            }else if(objectApiName == 'Order'){
                List<OrderItem> lineItems = (List<OrderItem>)JSON.deserialize(records, List<OrderItem>.class);
                upsert lineItems;
            }else if(objectApiName == 'Quote'){
                List<QuoteLineItem> lineItems = (List<QuoteLineItem>)JSON.deserialize(records, List<QuoteLineItem>.class);
                upsert lineItems;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updatePriceBook2(String priceBook2Id, String objectApiName, String recordId){
        try {
            sObject newSObjectRecord = Schema.getGlobalDescribe().get(objectApiName).newSObject();
            newSObjectRecord.put('Pricebook2Id', priceBook2Id);
            newSObjectRecord.put('Id', recordId);
            update newSObjectRecord;
            /*
                if(objectApiName == 'Opportunity'){
                    Opportunity obj = new Opportunity(Id = recordId, Pricebook2Id = priceBook2Id);
                    update obj;
                }else if(objectApiName == 'Order'){

                }
            */
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    

    @AuraEnabled(cacheable=true)
    public static List<sObject> fetchPriceBookId (string query){
        try {
            
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<SObject> queryLineitemRecords(String query){
        try {
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<sObject> listLineItem(String query){
        try {
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}