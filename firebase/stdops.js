/*
*   FIREBASE STANDARD OPS
*/

//  DEFINE DEPENDENCIES
var admin = require('firebase-admin');

//  INITIALIZE
var serviceAccount = {
    "type": "service_account",
    "project_id": "shopify-crm-app",
    "private_key_id": process.env.SHOPIFY_CRM_FIREBASE_KEY_ID,
    "private_key": process.env.SHOPIFY_CRM_FIREBASE_KEY.replace(/\\n/g, '\n'), 
    "client_email": "firebase-adminsdk-s1m29@shopify-crm-app.iam.gserviceaccount.com",
    "client_id": "112992132304197804346",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-s1m29%40shopify-crm-app.iam.gserviceaccount.com"
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://shopify-crm-app-default-rtdb.firebaseio.com"
});
var db = admin.database();

//  DEFINE MODULE
var firebaseStOps = {
    create: {
        newMerchCustomerRecord: CreateNewMerchCustomerRecord,
        newMerchantRecord: CreateNewMerchantRecord
    },
    get: {
        crmMerchIdviaSqMrchId: GetCrmMerchIdviaSqMrchId
    },
    test: test
};

/*
*   PRIVATE: EXTRACT KEY
*/
async function _extractKey(anObject) {
    //  NOTIFY PROGRESS
   // console.log('received this objet', anObject);

    //  DEFINE LOCAL VARIABLES
    var aKey = "";

    //  ITERATE OVER OBJECT
    Object.keys(anObject).forEach(function(element) {
        aKey = element;
    });

    //  RETURN VALUE
    return aKey;
};

/*
*   PRIVATE: PUSH
*/
async function _push(path, data) {
    //  NOTIFY PROGRESS
    //console.log('writing firease push', path, data);

    //  DEFINE LOCAL VARIABLES
    var writePath = db.ref(path);

    //  return value
    return await writePath.push(data)
};


/*
*   GET CRM CUSTOMER ID VIA SQUARE MERCHANT ID
*/
async function GetCrmMerchIdviaSqMrchId(sq_merchant_id) {
    //  NOTIFY PROGRESS
    //console.log('Firebase/GetCrmMerchIdviaSqMrchId: Getting the crm merchant id via suqare merchant id: ', sq_merchant_id);

    //  DEFINING LOCAL VARIABLE
    var ref = db.ref('Merchants');
    var queryRef = ref.orderByChild('sqMerchId').equalTo(sq_merchant_id);

    try {
        var merchantIdsnapshot = await queryRef.once('value')
        return _extractKey(merchantIdsnapshot.val());
    } catch (error) {
        console.log('GetCrmCustomerIdviaSqMrchId Error: ', error);
        return error
    }
};

/*
*
*/
async function CreateNewMerchCustomerRecord(mercId, data) {
    //  NOTIFY PROGRESS
    console.log('Creating a new custome record');

    //  DEFINE LOCAL VARIABLES
    var writePath = "Merchants/" + mercId + "/Customers";

    return await _push(writePath, data);
};

/*
*   CREATE NEW MERCHANT RECORD
*/
async function CreateNewMerchantRecord(data) {
    //  NOTIFY PROGESS
    console.log("Creating a new merchant record");

    return await _push('merchant', data);
};

//  FUNCTION: TEST
async function test() {
    //  NOTIIFY PROGRESS
    console.log('this is the firebase test function');
    var ref = db.ref("test");
    ref.once("value", function(snapshot) {
    console.log(snapshot.val());
    });
};

//  EXPORT MODULE
module.exports = firebaseStOps;