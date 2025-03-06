public with sharing class metadataController {
    
    @AuraEnabled(cacheable=true)
    public static List<ParentObjectDetails__mdt> metadataRetriver(String objectName) {
        try {
            return [
                SELECT Id, DeveloperName, MasterLabel, 
                       Label, QualifiedApiName,
                       Object_Api_Name__c, Place_to_be_used__c 
                       
                FROM ParentObjectDetails__mdt
                WHERE Object_Api_Name__c = :objectName
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<sObject> getRecords(String objectApiName, String placeToBeUsed, string Usedfor ) {
        try {
            return  [
                SELECT Id,  
                Parent_Object_Details__c,  
                Object_Api_Name__c, 
                Object_Api_Name__r.QualifiedApiName,  
                Field_Api_Name__c, 
                Field_Api_Name__r.QualifiedApiName,
                 Order__c , Used_for__c 
                FROM 
                    Child_Field_details__mdt  
                WHERE 
                    Parent_Object_Details__r.Object_Api_Name__r.QualifiedApiName =: objectApiName  
                AND 
                    Parent_Object_Details__r.Place_to_be_used__c = :placeToBeUsed  
                AND 
                    ( Used_for__c =: Usedfor OR Used_for__c = 'Both EditNew Record')
                 ORDER BY 
                    Order__c  ASC
                LIMIT 100
            ];
        
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving metadata: ' + e.getMessage());
        }
    }
}
