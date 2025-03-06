public with sharing class addProducts {
    

    @AuraEnabled(cacheable=true)
    public static List<SObject> queryLineitemRecords(String query){
        try {
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}