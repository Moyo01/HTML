public with sharing class SearchProductService {
    
    @AuraEnabled
    public static List<sObject> searchProducts( string searchKey, string priceBook2Id){
        string likeparam = '%'+ searchKey + '%';
        try {
           return [SELECT IsActive, Id, Name, Pricebook2Id, Product2Id, UnitPrice, ProductCode,Product2.IsActive,
                    Product2.Name, Product2.ProductCode, Product2.Family, Product2.Description
                         FROM PricebookEntry 
                                  WHERE IsActive = true AND  
                                                    (Name like: likeparam  OR  ProductCode like: likeparam) LIMIT 100 ]; 
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}