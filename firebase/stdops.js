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
console.log(serviceAccount);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://shopify-crm-app-default-rtdb.firebaseio.com"
});
var db = admin.database();

//  DEFINE MODULE
var firebaseStOps = {
    get: {
        crmCustomerIdviaSqMrchId: GetCrmCustomerIdviaSqMrchId
    },
    test: test
};

/*
*   GET CRM CUSTOMER ID VIA SQUARE MERCHANT ID
*/
async function GetCrmCustomerIdviaSqMrchId(sq_merchant_id) {
    //  NOTIFY PROGRESS
    console.log('Getting the crm customer id via suqare merchant id: ', sq_merchant_id);

    return '11';
};

//  FUNCTION: TEST
async function test() {
    //  NOTIIFY PROGRESS
    console.log('this is the firebase test function');
    var db = admin.database();
    var ref = db.ref("test");
    ref.once("value", function(snapshot) {
    console.log(snapshot.val());
    });
};

//  EXPORT MODULE
module.exports = firebaseStOps;