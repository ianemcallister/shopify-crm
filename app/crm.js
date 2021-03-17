/*
*   CKC CRM Module
*/

//  DEFINE DEPENDENCIES
const fs          = require('fs');
const Firebase    = require('../firebase/stdops.js');

//  DEFINE MODULE
var omniCRM = {
    consolidateCustomerRecords: ConsolidateCustomerRecords,
    get: {
        crmMerchIdviaSqMrchId: GetCrmMerchIdViaSqMrchId,
        merchCustomerRecordViaPhone: GetMerchCustomerRecordViaPhone
    }
};

/*
*   CONSOLIDATE CUSTOMER RECORDS
*
*   @param([shopifyCustomerRecord, SquareCustomerRecord, FirebaseCustomerRecord, FirebaseMerchantId])
*   @return({ customerProfile.json })
*/
async function ConsolidateCustomerRecords(allCustomerRecords) {
    //  NOTIFY PROGRESS
    console.log("ConsolidateCustomerRecords: ", allCustomerRecords);

    //  DEFINE LOCAL VARIABLES
    var shopfyCR = allCustomerRecords[0];
    var squareCR = allCustomerRecords[1];
    var firebsCR = allCustomerRecords[2];
    var merchtId = allCustomerRecords[3];
    var params   = allCustomerRecords[4];
    var templateFile = fs.readFileSync('./models/customerProfile.json', 'utf8');
    var template = JSON.parse(templateFile);
    var timestamp = new Date(Date.now()).toISOString();;
   
    
    try {
        //  1. PRIVATE: CREATED AT
        if(firebsCR._createdAt == undefined) { template._createdAt = timestamp; } else { template._createdAt =  firebsCR._createdAt; }
        
        //  2. PRIVATE: UPDATED AT
        template._updatedAt = timestamp;

        //  3. PRIVATE: _id
        if(firebsCR._id == undefined) { template._id = Firebase.get.pushId('Customers'); } else { template._id =  firebsCR._id; }
        
        //  3.5 PRIVATE: _merchantId
        if(firebsCR._merchantId == undefined || firebsCR._merchantId == "") { template._merchantId = merchtId; } else { template._merchantId =firebsCR._merchantId; }

        //  4. EXTERNAL IDS
        if(firebsCR.externalIds == undefined) {
            firebsCR.externalIds = {};
            template.externalIds.shopifyId          = shopfyCR.id;
            template.externalIds.squareId           = squareCR.id;
            template.externalIds.squareLoyaltyId    = params.sqLoyalty;
            template.externalIds.squareMerchantId   = params.sqMercantId;
        } else {
            //  4.1     SHOPIFY ID
            if(firebsCR.externalIds.shopifyId == undefined || firebsCR.externalIds.shopifyId == "") { template.externalIds.shopifyId  = shopfyCR.id; } else { template.externalIds.shopifyId = firebsCR.externalIds.shopifyId; }

            //  4.2     SQUARE ID
            if(firebsCR.externalIds.squareId == undefined || firebsCR.externalIds.squareId == '') { template.externalIds.squareId = squareCR.id; } else { template.externalIds.squareId = firebsCR.externalIds.squareId; }
            
            //  4.3     SQUARE LOYALTY
            if(firebsCR.externalIds.squareLoyaltyId == undefined || firebsCR.externalIds.squareLoyaltyId == "") { template.externalIds.squareLoyaltyId = params.sqLoyalty } else { template.externalIds.squareLoyaltyId = firebsCR.externalIds.sqLoyalty; }

            //  4.4     SQUARE MERCHANT ID
            if(firebsCR.externalIds.squareMerchantId == undefined || firebsCR.externalIds.squareMerchantId == "") { template.externalIds.squareMerchantId = params.sqMercantId } else { template.externalIds.squareMerchantId = firebsCR.externalIds.squareMerchantId; }

            //  4.5     FACEBOOK ID
            //  4.6     INSTAGRAM ID
        }

        //  5. CREATION SOURCE

        //  6. EMAIL
        if(firebsCR.email == undefined || firebsCR.email == "") {
            if(shopfyCR.email != undefined) {
                template.email = shopfyCR.email;
            } else if(squareCR.email != undefined) {
                template.email = squareCR.email;
            } else {
                template.email = template.email;
            }
        } else if(firebsCR.email != shopfyCR.email) {
            template.email = shopfyCR.email
        } else {
            template.email = firebsCR.email;
        }
        
        //  7. PHONE
        template.phoneNumber = params.phone;

        //  8. GIVEN NAME
        if(firebsCR.givenName == undefined || firebsCR.givenName == "") {
            if(shopfyCR.first_name != undefined) {
                template.givenName = shopfyCR.first_name;
            } else if(squareCR.givenName != undefined) {
                template.givenName = squareCR.givenName;
            } 
        } else if(firebsCR.givenName != shopfyCR.first_name) {
            template.givenName = shopfyCR.first_name;
        } else {
            template.givenName = firebsCR.givenName
        }

        //  9. FAMILY NAME
        if(firebsCR.familyName == undefined || firebsCR.familyName == "") {
            if(shopfyCR.last_name != undefined) {
                template.familyName = shopfyCR.last_name;
            } else if(squareCR.familyName != undefined) {
                template.familyName = squareCR.familyName;
            } 
        } else if(firebsCR.familyName != shopfyCR.last_name) {
            template.familyName = shopfyCR.last_name;
        } else {
            template.familyName = firebsCR.familyName;
        }

        // 10. PHYSICAL ADDRESSES

        // 11. PREFERENCES
        if(firebsCR.preferences != undefined) {
            //  11.1    Email Unsubscribed (true or false)
            //  11.2    Opt In to Email (true or false)
            //  11.3    Opt In to SMS (true or false)
            //  11.4    Accepts Marketing (true or false)
            //  11.5    Perfered Communication
            //  11.6    Marketing Opt In Level
        }

        // 12. STATUS
        if(firebsCR.status != undefined) {
            //  12.1    Email Verified? (true or false)
            //  12.2    SMS Verified? (true or false)
            //  12.3    Accepts Marketing Updated At
            //  12.4    Invite to Refereal At
            //  12.5    Referral Enrolled (true or false)
            //  12.6    Rewards Enrolled (true or false)
            //  12.7    Referral Enrolled at
            
            //  12.8    Rewards Enrolled at
            if(firebsCR.status.rewardsEnrolledAt == '' && params.rewardsEnrolledAt != undefined && params.rewardsEnrolledAt != "") { template.status.referralEnroledAt = params.rewardsEnrolledAt; }
            
        } else {
            template.status.rewardsEnrolledAt = params.rewardsEnrolledAt;
        }

        
        //  RETURN OBJECT
        return template;
        
    } catch (error) {
        console.log('ConsolidateCustomerRecords Error: ', error);
    }
};

/*
*   GET SQUARE CUSTOMER ID VIA SQUARE MERCHANT ID
*/
async function GetCrmMerchIdViaSqMrchId(sq_merchant_id) {
    //  NOTIFY PROGRESS
    //console.log('CRM/GetCrmMerchIdViaSqMrchId: getting Merchent id from square merchant id: ', sq_merchant_id);

    //  1. COLLECT MERCHANT ID
    return await Firebase.get.crmMerchIdviaSqMrchId(sq_merchant_id);
     
};

/*
*   GET CUSTOMER RECORD
*/
async function GetMerchCustomerRecordViaPhone(crmMerchId, merchCustPhone, merchCustsqLyltyId) {
    //  NOTIFY PROGRESS
    console.log('GetMerchCustomerRecordViaPhone: ', crmMerchId, merchCustPhone, merchCustsqLyltyId);

    // EXECUTE ASYNC WORK
    try {
        var customerRecord = await Firebase.get.merchCustRecord(crmMerchId, merchCustPhone);
        return { shopifyId: customerRecord.shopifyId, rewardsEnrolled: customerRecord.rewardsEnrolled }
    } catch (error) {
        console.log('error', error);
    }

};

//  EXPORT MODULE
module.exports = omniCRM;