/*
*   CKC CRM Module
*/

//  DEFINE DEPENDENCIES
const fs          = require('fs');
const Firebase    = require('../firebase/stdops.js');

//  DEFINE MODULE
var omniCRM = {
    buildReferralRecord: BuildReferralRecord,
    consolidateCustomerRecords: ConsolidateCustomerRecords,
    get: {
        crmMerchIdviaSqMrchId: GetCrmMerchIdViaSqMrchId,
        merchCustomerRecordViaPhone: GetMerchCustomerRecordViaPhone
    }
};

/*
*   BUILD REFERRAL RECORDS
*/
async function BuildReferralRecord(allCustomerRecords, ownerRecord) {
    //  NOTIFY PROGRESS
    console.log('BuildReferralRecord: ', ownerRecord);

    //  LOCAL VARIABLES
    var redirect = allCustomerRecords[5];
    var discount = allCustomerRecords[6];
    var templateFile = fs.readFileSync('../models/referralTemplate.json', 'utf8');
    var template = JSON.parse(templateFile);
    var timestamp = new Date(Date.now()).toISOString();

    //  EXECUTE
    try {
        //  1. ID
        template._id = await Firebase.get.pushId('ReferralAccts');

        //  2. OWNER ID
        template.ownerId = ownerRecord._id;

        //  3. OWNER PHONE
        template.ownerPhone = ownerRecord.phoneNumber;

        //  4. OWNER EMAIL
        template.ownerEmail = ownerRecord.email;

        //  5. DEFAULT REFERRAL CODE
        template.defaultReferralCode = discount.code;

        //  6. DEFAULT REFERRAL CODE URL
        template.defaultReferralCodeUrl = redirect.path;

        //  7. DEFAULT REFERRAL CODE ID
        template.defaultReferralCodeId = discount.id;

        //  8. DEFAULT REDIRECT ID
        template.defaultReferralRedirectId = redirect.id;

        //  9. DEFAULT REDIRECT TARGET
        template.defaultRedirectTarget = redirect.target;

        //  return object
        return template;

    } catch (error) {
        console.log('BuildReferralRecord error: ', error);
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
    //var redirect = allCustomerRecords[5];
    //var discount = allCustomerRecords[6];
    var templateFile = fs.readFileSync('../models/customerProfile.json', 'utf8');
    var template = JSON.parse(templateFile);
    var timestamp = new Date(Date.now()).toISOString();
   
    
    try {
        //  1. PRIVATE: CREATED AT
        if(firebsCR._createdAt == undefined) { template._createdAt = timestamp; } else { template._createdAt =  firebsCR._createdAt; }
        
        //  2. PRIVATE: UPDATED AT
        template._updatedAt = timestamp;

        //  3. PRIVATE: _id
        if(firebsCR._id == undefined) { template._id = Firebase.get.pushId('Customers'); } else { template._id =  firebsCR._id; }
        
        //  4 PRIVATE: _merchantId
        if(firebsCR._merchantId == undefined || firebsCR._merchantId == "") { template._merchantId = merchtId; } else { template._merchantId =firebsCR._merchantId; }

        //  5. EXTERNAL IDS
        if(firebsCR.externalIds == undefined) {
            firebsCR.externalIds = {};
            template.externalIds.shopifyId          = shopfyCR.id;
            if(squareCR != undefined) { template.externalIds.squareId = squareCR.id; } else { template.externalIds.squareId = ""; }
            
            template.externalIds.squareMerchantId   = params.sqMercantId;
        } else {
            //  5.1     SHOPIFY ID
            if(firebsCR.externalIds.shopifyId == undefined || firebsCR.externalIds.shopifyId == "") { template.externalIds.shopifyId  = shopfyCR.id; } else { template.externalIds.shopifyId = firebsCR.externalIds.shopifyId; }

            //  5.2     SQUARE ID
            if(firebsCR.externalIds.squareId == undefined || firebsCR.externalIds.squareId == '') { template.externalIds.squareId = squareCR.id; } else { template.externalIds.squareId = firebsCR.externalIds.squareId; }

            //  5.4     SQUARE MERCHANT ID
            if(firebsCR.externalIds.squareMerchantId == undefined || firebsCR.externalIds.squareMerchantId == "") { template.externalIds.squareMerchantId = params.sqMercantId } else { template.externalIds.squareMerchantId = firebsCR.externalIds.squareMerchantId; }

            //  5.5     FACEBOOK ID
            //  5.6     INSTAGRAM ID
        }

        //  6. CREATION SOURCE

        //  7. EMAIL
        if(firebsCR.email == undefined || firebsCR.email == "") {
            if(shopfyCR.email != undefined) {
                template.email = shopfyCR.email;
            } else if(squareCR != undefined) {
                if(squareCR.email != undefined) { template.email = squareCR.email; }
            } else {
                template.email = template.email;
            }
        } else if(firebsCR.email != shopfyCR.email) {
            template.email = shopfyCR.email
        } else {
            template.email = firebsCR.email;
        }
        
        //  8. PHONE
        template.phoneNumber = params.phone;

        //  9. GIVEN NAME
        if(firebsCR.givenName == undefined || firebsCR.givenName == "") {
            if(shopfyCR.first_name != undefined && shopfyCR.first_name != "TEMPORARY") {
                template.givenName = shopfyCR.first_name;
            } else if(squareCR != undefined) {
                if(squareCR.givenName != undefined) { template.givenName = squareCR.givenName; }
            } 
        } else if(firebsCR.givenName != shopfyCR.first_name) {
            template.givenName = shopfyCR.first_name;
        } else {
            template.givenName = firebsCR.givenName
        }

        // 10. FAMILY NAME
        if(firebsCR.familyName == undefined || firebsCR.familyName == "") {
            if(shopfyCR.last_name != undefined) {
                template.familyName = shopfyCR.last_name;
            } else if(squareCR != undefined) {
                if(squareCR.familyName != undefined) { template.familyName = squareCR.familyName; }
            } 
        } else if(firebsCR.familyName != shopfyCR.last_name) {
            template.familyName = shopfyCR.last_name;
        } else {
            template.familyName = firebsCR.familyName;
        }

        // 11. PHYSICAL ADDRESSES

        // 12. PREFERENCES
        if(firebsCR.preferences != undefined) {
            //  12.1    Email Unsubscribed (true or false)
            //  12.2    Opt In to Email (true or false)
            //  12.3    Opt In to SMS (true or false)
            //  12.4    Accepts Marketing (true or false)
            //  12.5    Perfered Communication
            //  12.6    Marketing Opt In Level
        }

        // 13. STATUS
        if(firebsCR.status != undefined) {
            //  13.1    Email Verified? (true or false)
            //  13.2    SMS Verified? (true or false)
            //  13.3    Accepts Marketing Updated At
            
        } else {
            
        }

        //  14. LOYALTY ENROLLED?
        template.loyaltyEnrolled = true;

        //  15. REFERRALS
        if(firebsCR.referrals == undefined) {
            //  15.1    WAS REFERRED?
            //  15.2    REFERRED BY
            //  15.3    REFERRED AT
            //  15.4    LOGIN INVITE SENT AT
            //  15.5    LOGIN INVITE COMPLETED AT
            //  15.6    LOGIN INVITE COMPLETED?

        } else {
            template.referrals = firebsCR.referrals
        }

        //  16. REWARDS
        if(firebsCR.rewards == undefined) {
            //  16.1    REWARDS ENROLLED AT
            if(params.rewardsEnrolledAt != undefined) { template.rewards.rewardsEnrolledAt = params.rewardsEnrolledAt; }
            

            //  16.2    SQUARE LOYALTY ID
            template.rewards.squareLoyaltyId  = params.sqLoyalty;
            
        } else {
            if(firebsCR.rewards.rewardsEnrolledAt == '' && params.rewardsEnrolledAt != undefined && params.rewardsEnrolledAt != "") { template.rewards.referralEnroledAt = params.rewardsEnrolledAt; }
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