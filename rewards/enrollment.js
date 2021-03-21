/*
*   REWARDS ENROLLMENT MODULE  
*/
//  DEFINE DEPENDENCIES
const CRM       = require('../app/crm.js');
const till      = require('../till/enrollment.js');
const Shopify   = require('../shopify/stdops.js');
const Square    = require('../square/stdops.js');
const Firebase  = require('../firebase/stdops.js');

//  DEFINE MODULE
var rewards = {
    enrollmentInvite: {
        viaSMS: EnrollmentInviteViaSMS
    } 
};

/*
*   PRIVATE: VALIDATE CUSTOMER PROFILES
*/
async function _validateCustomerProfiles(type, aRecord, phoneNumber) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var timestamp = new Date(Date.now()).toISOString();

    //  EXDCUTE ASYNC WORK
    try {
        if(aRecord == undefined) {
            switch(type) {
                case 'Shopify':
                    //  CREATE A NEW SHOPIFY CUSTOMER AND RETURN THE RECORD
                    var newShopifyRecord = await Shopify.createNewShopifyCustomer(phoneNumber);
                    return newShopifyRecord;

                    break;
                case 'Square':
                    //  CREATE A NEW SQUARE CUSTOMER AND RETURN THE RECORD -- NOT REQUIRED REIGHT NOW
                    
                    break;
                case 'FirebaseMerchId':
                    //  CREATE A NEW FIREBASE MERCHATN RECORD AND RETURN THE KEY
                    var newMerchantId = Firebase.get.pushId('Merchants');
                    await Firebase.CreateNewMerchantRecord({
                        _createdAt: timestamp,
                        _updatedAt: timestamp,
                        Channels: [],
                        id: newMerchantId,
                        merchantName: "",
                        shopifyMerchId: "",
                        sqMerchId: sq_merchant_id,
                    }, newMerchantId);

                    //  SAVE THE ID
                    return newMerchantId;

                    break;
                case 'FirebaseCustRrd':
                    //  CREATE A NEW FIREBASE CUSTOMER RECORD AND RETURN THE RECORD - TEMPORARY ONLY
                    var newCustomerId = Firebase.get.pushId('Customers');
                    var newCustomer = {
                        _id:  newCustomerId
                    };
                    await Firebase.create.newMerchCustomerRecord(newCustomer, newCustomerId);
                    return newCustomer;

                    break;
                case 'Redirect':
                    //  NOTIFY PROGRESS
                    console.log('validating redirect');

                    var newRedirect = Shopify.create.redirect(phoneNumber);
                    return newRedirect;

                    break;
                case 'Referral':
                    //  NOTIFY PROGRESS
                    console.log('validating referral', phoneNumber);

                    var newReferral = Shopify.create.referralCode(phoneNumber);
                    return newReferral;

                    break;
                default:
                    break;
            };
        } else { return aRecord; }
            
    } catch (error) {
        console.log("_validateCustomerProfiles error: ", error);
    }
};

/*
*   PRIVATE: GET SHOPIFY CUSTOMER ID
*/
async function _GetMerchCustomerRecord(merchCustPhone, merchCustsqLyltyId, sq_merchant_id, rewardsEnrollAt){
    //  NOTIFY PROGRESS
    //console.log('_GetMerchCustomerRecord: ', merchCustPhone, merchCustsqLyltyId, sq_merchant_id);

    //  DEFINE LOCAL VARIABLES

    try {
        //  1. COLLECT PROFILES FROM ALL RESOURCES [Square, Shopify, Firebase]
        var allRecordsRaw = await Promise.all([
            Shopify.get.merchCustomerRecord(merchCustPhone),
            Square.get.customerByLoyaltyId(merchCustsqLyltyId),
            Firebase.get.merchCustRecord(merchCustPhone),
            Firebase.get.crmMerchIdviaSqMrchId(sq_merchant_id),
            {phone: merchCustPhone, sqLoyalty: merchCustsqLyltyId, sqMercantId: sq_merchant_id, rewardsEnrolledAt: rewardsEnrollAt },
            Shopify.get.urlRedirect(merchCustPhone),
            Shopify.get.referralCode(merchCustPhone)
        ]);
        //console.log('_GetMerchCustomerRecord: ', allRecordsRaw);

        //  2. VALIDATE RETURNING DATA
        var validatedRecords = await Promise.all([
            _validateCustomerProfiles('Shopify', allRecordsRaw[0], merchCustPhone),
            _validateCustomerProfiles('Square', allRecordsRaw[1]),
            _validateCustomerProfiles('FirebaseCustRrd', allRecordsRaw[2]),
            _validateCustomerProfiles('FirebaseMerchId', allRecordsRaw[3]),
            _validateCustomerProfiles('object', allRecordsRaw[4]),
            _validateCustomerProfiles('Redirect', allRecordsRaw[5], merchCustPhone),
            _validateCustomerProfiles('Referral', allRecordsRaw[6], merchCustPhone)
        ]);

        //  2. CONSOLIDATE MERCHANT CUSTOMER RECORDS
        var comprehensiveCustomerRecord = await CRM.consolidateCustomerRecords(validatedRecords);
        //console.log('comprehensiveCustomerRecord: ', comprehensiveCustomerRecord);

        //  3. BUILD REFERRAL RECORD
        var newReferralRecord = await CRM.buildReferralRecord(validatedRecords, comprehensiveCustomerRecord);

        //  4. UPDATE FIREBASE CUSTOMER RECORDS
        await Firebase.updateCustomerRecord(comprehensiveCustomerRecord);

        //  5. UPDATE FIREBASE REFERRAL RECORDS
        await Firebase.updateReferralRecord(newReferralRecord);


        //  4. RETURN CUSTOMER RECORD
        return { customer: comprehensiveCustomerRecord, referral: newReferralRecord} ;
        
    } catch (error) {
        console.log('_GetMerchCustomerRecord Error: ', error);
    }
    
};

/*
*   DELIGHT CIRCLE ENROLLMENT INVITE VIA SMS
*
*
*   @param(sqLyltyId) - String: '664c22ba-9460-45a5-8917-381ae72dcfdc'   
*   @param(phone) - String: "+15555555555" 12 character
*/
async function EnrollmentInviteViaSMS(merchCustPhone, merchCustloyaltyId, sq_merchant_id, rewardsEnrolledAt) {
    //  DEFINE LOCAL VARIABLES

    //  NOTIFY PROGERSS
    //console.log('EnrollmentInviteViaSMS: sqLyltyId(', merchCustloyaltyId, '), phone(', merchCustPhone,'), merchant_id(', sq_merchant_id, ")");
    
    try {
        //  1. RETREIVE CUSTOMER RECORD & REFRERAL CODE
        var customerData = await _GetMerchCustomerRecord(merchCustPhone, merchCustloyaltyId, sq_merchant_id, rewardsEnrolledAt);
        
        //  2. SEPERATE CUSTOMER RECORD AND REFERRAL CODE
        var customerRecord = customerData.customer;
        var referralRecord = customerData.referral;

        //  2. Verify Enrollment Status
        if(!customerRecord.status.referralEnrolled) {

            //  3. Generate Enrollment Url
            var customerEnrollmentUrl = await Shopify.get.merchCustomerActivationUrl(customerRecord.externalIds.shopifyId);
            
            //  NOTIFY PROGRESS
            console.log('got this enrollment url: ', customerEnrollmentUrl);

            //  4. Send Enrollment SMS
            await till.send.referralCodeNotification(merchCustPhone, referralRecord);
            //await till.send.enrollmentInvite(merchCustPhone, merchCustEnrollmentUrl);

            //  5. Notify Status
            console.log(merchCustPhone, ' sent referral link');
            
            //  6. Record Touchpoint

            //  7. Update Shopify record
            await Shopify.customer.update(
                customerRecord.externalIds.shopifyId,
                {
                    email: customerRecord.email,
                    first_name: customerRecord.givenName,
                    last_name: customerRecord.familyName,
                    default_address: {
                        first_name: customerRecord.givenName,
                        last_name: customerRecord.familyName,
                        name: customerRecord.givenName + " " + customerRecord.familyName,
                        phone: merchCustPhone
                    }
                }
            )
            
        } else {
            //  3. Notify Status
            console.log(merchCustPhone, ' aready enrolled.');

        }  

    //  HANDLE ANY ERRORS THAT COME UP    
    } catch (error) {
        console.log('EnrollmentInviteViaSMS Error: ', error);
    }

}

//  EXPORT MODULE
module.exports = rewards;