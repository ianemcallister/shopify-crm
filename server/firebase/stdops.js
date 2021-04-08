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
    updateCustomerRecord: UpdateCustomerRecord,
    updateReferralRecord: UpdateReferralRecord,
    update: _update,
    create: {
        newMerchCustomerRecord: CreateNewMerchCustomerRecord,
        newMerchantRecord: CreateNewMerchantRecord
    },
    get: {
        pushId: GetPushId,
        crmMerchIdviaSqMrchId: GetCrmMerchIdviaSqMrchId,
        merchCustShopifyId: GetMerchCustShopifyId,
        merchCustRecord: GetMerchCustRecord
    },
    merchants: {
        channels: {
            get: GetMerchantChannel,
            create: CreateMerchantChannel,
            mrInstances: {
                create: CreateMerchantMRInstance
            },
            seasons: {
                get: GetMerchantChannelSeason,
                create: CreateMerchantChannelSeason
            }
        },
        events: {
            createBatch: CreateMerchentEventsBatch
        },
        assetAccts: {
            create: CreateMerchantAssetAccount
        }
    },
    Inventory: {
        Roles: {
            Create: CreateInventoryRole
        },
        Groups: {
            Create: CreateInventoryGroups
        },
        Items: {
            Create: CreateInventoryItems
        },
        MFG: {
            get: GetInventoryMfgSku,
            list: GetInventoryMfgList
        }
    },
    Actualizations: {
        Mfg: {
            dailyReports: GetDailyReports,
            createReport: CreateMfgReport,
            recordByDevice: GetMFGRecordByDevice,
            updateOrders: UpdateMfgOrders,
            updateSupplies: UpdateMfgSupplies
        }
    },
    test: test
};

/*
*   PRIVATE: EXTRACT KEY
*/
function _extractKey(anObject) {
    //  NOTIFY PROGRESS
    console.log('received this objet', anObject);

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
*   PRIVATE: EXTRACT FIELD
*/
function _extractField(field, aRecord) {
    var aKey = '';
    Object.keys(aRecord).forEach(function(key){
        aKey = key;
    });
    //console.log('aRecord', aRecord, aKey, field);
    return aRecord[aKey][field];
};

/*
*   PRIVATE: EXTRACT KEYED OBJECT
*/
function _extractKeyedObject(aRecord) {
    //  LOCAL VARIABLES
    var aKey = "";

    if(aRecord == null) {
        return undefined;
    } else {
        Object.keys(aRecord).forEach(function(key) {
            aKey = key;
        });
    
        return aRecord[aKey];
    }
    
};

/*
*   PRIVATE: ONCE
*/
async function _once(path) {
    //  NOTIFY
    //  LOCAL VARIABLES
    var ref = db.ref(path);

    //  EXECUTE
    return ref.once('value');
};

/*
*   PRIVATE: SET
*/
async function _set(path, data) {
    var ref = db.ref(path);

    return ref.set(data);
};

/*
*   PRIVATE: UPDATE
*/
async function _update(path, data) {
    var ref = db.ref(path);

    return ref.update(data);
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
*   PRIVATE: _arrayToUpdate
*/
function _arrayToUpdate(anArray, path) {
    //  NOTIFY
    //  LOCAL VARIABLES
    var returnObject = {};
    var timestamp = new Date(Date.now()).toISOString();

    //  EXECUTE
    //  ITERATE OVER THE ARRAY
    anArray.forEach(function(object) {
        var recordId = GetPushId(path);
        returnObject[recordId] = object;
        returnObject[recordId]._id = recordId;
        returnObject[recordId]._createdAt = timestamp;
        returnObject[recordId]._updatedAt = timestamp;
    });

    return returnObject;
};


/*
*   CREATE MERCHANT CHANNEL
*/
async function CreateMerchantChannel(merchId, record) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var writePath = 'Merchants/' + merchId + "/Channels";
    var timestamp = new Date(Date.now()).toISOString();
    record._createdAt = timestamp;
    record._updatedAt = timestamp;
    record._id = GetPushId(writePath);
    var ref = db.ref(writePath + "/" + record._id);

    //  EXECUTE
    try {
        ref.set(record, function(error) {
            if (error) {
                console.log("Merchant Account Data could not be saved." + error);
              } else {
                console.log("Merchant Account Data saved successfully.");
              }
        });
    } catch (error) {
        console.log('CreateMerchantChannel error: ', error);
    }
};

/*
*   CREATE MERCHANT MOBILE RETAIL INSTANCE
*/
async function CreateMerchantMRInstance(merchantId, channelId, record) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var ref = db.ref('Merchants/' + merchantId + "/Channels/" + channelId + "/mrInstances");
    var timestamp = new Date(Date.now()).toISOString();
    record._createdAt = timestamp;
    record._updatedAt = timestamp;

    //  EXECUTE
    try {
        ref.push(record, function(error) {
            if (error) {
                console.log("Merchant MR Instance Data could not be saved." + error);
              } else {
                console.log("Merchant MR Instance Data saved successfully.");
              }
        });
    } catch (error) {
        console.log('CreateMerchantChannel error: ', error);
    }
};


/*
*
*/
async function UpdateReferralRecord(referralAcctRecord) {
    //  NOTIFY PROGRESS
    console.log('UpdateReferralRecord: ', referralAcctRecord);
    
    //  LOCAL VARIABLES
    var ref = db.ref('ReferralAccts/' + referralAcctRecord._id);

    //  EXECUTE
    try {
        ref.set(referralAcctRecord, function(error) {
            if (error) {
                console.log("referralAcctRecord Data could not be saved." + error);
              } else {
                console.log("referralAcctRecord Data saved successfully.");
              }
        });
    } catch (error) {
        console.log('UpdateReferralRecord error: ', error);
    }
};

/*
*   UPDATE CUSTOMER RECORD
*/
async function UpdateCustomerRecord(customeRecord) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var ref = db.ref('Customers/' + customeRecord._id);
    
    //  EXECUTE ASYNC WORK
    try {
        ref.set(customeRecord, function(error) {
            if (error) {
                console.log("customeRecord Data could not be saved." + error);
              } else {
                console.log("customeRecord Data saved successfully.");
              }
        });
    } catch (error) {
        console.log('Firebase/UpdateCustomerRecord Error: ', error );
    }
};

/*
*   GET PUSH ID
*/
function GetPushId(path) {
    var ref = db.ref(path); 
    var newObject = ref.push();
    return newObject.key;
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
        return _extractField("id", merchantIdsnapshot.val());
    } catch (error) {
        console.log('GetCrmCustomerIdviaSqMrchId Error: ', error);
        return error
    }
};

/*
*   GET MERCHANT CHANNEL RECORD
*/
async function GetMerchantChannel(merhcantId, channelId) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var readPath = 'Merchants/' + merhcantId + "/Channels/" + channelId;
    console.log("GetMerchantChannel: ", readPath);

    //  EXECUTE
    try {
        var record = await _once(readPath)
        return record.val();
    } catch (error) {
        console.log('GetMerchantChannel ERror:');
        console.log(error);
    }
};

/*
*   GET MERCHANT CHANNEL SEASON RECORD
*/
async function GetMerchantChannelSeason(merhcantId, channelId, seasonId) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var readPath = 'Merchants/' + merhcantId + "/Channels/" + channelId + "/Seasons/" + seasonId;

    //  EXECUTE
    try {
        var record = await _once(readPath)
        return record.val();
    } catch (error) {
        console.log('GetMerchantChannelSEASON ERror:');
        console.log(error);
    }
};

/*
*
*/
async function CreateNewMerchCustomerRecord(data, id) {
    //  NOTIFY PROGRESS
    console.log('Creating a new customer record');

    //  DEFINE LOCAL VARIABLES
    var writePath = "Customers/" + id;

    if(id != undefined) {
        return await _set(writePath, data);
    } else {
        return await _push(writePath, data);
    }
    
};

/*
*   CREATE NEW MERCHANT RECORD
*/
async function CreateNewMerchantRecord(data, id) {
    //  NOTIFY PROGESS
    console.log("Creating a new merchant record");

    if(id != undefined) {
        return await _set("Merchants/" + id, data);
    } else {
        return await _push('Merchants', data);
    }
    
};

/*
*
*/
async function GetMerchCustShopifyId(merchCustPhone) {
    //  NOTIFY PROGERSS
    //console.log('Firebase/Stdops/GetMerchCustShopifyId: ', crmMerchId, merchCustPhone);

    //  LOCAL VARIABLES
    var ref = db.ref('Customers');
    var queryRef = ref.orderByChild('phoneNumber').equalTo(merchCustPhone);

    try {
        var merchCustRecordSnapshot = await queryRef.once('value');
        return _extractField("shopifyId", merchCustRecordSnapshot.val());
    } catch (error) {
        console.log('GetCrmCustomerIdviaSqMrchId Error: ', error);
        return error
    }
};

/*
*   GET MERCHANT CUSTOMER RECORD
*/
async function GetMerchCustRecord(merchCustPhone) {
    //  NOTIFY PROGRESS
    console.log('Firebase/Stdops/GetMerchCustRecord: ', merchCustPhone);

    //  LOCAL VARIABLES
    var ref = db.ref('Customers');
    var queryRef = ref.orderByChild('phoneNumber').equalTo(merchCustPhone);

    try {
        var merchCustRecordSnapshot = await queryRef.once('value');
        return _extractKeyedObject(merchCustRecordSnapshot.val());
    } catch (error) {
        console.log('GetMerchCustRecord Error: ', error);
        return error
    }
}

/*
*
*/
async function CreateMerchantChannelSeason(merchantId, channelId, record) {
    //  NOTIFY
    //  LOCAL
    var writePath = 'Merchants/' + merchantId + "/Channels/" + channelId + "/Seasons";
    var timestamp = new Date(Date.now()).toISOString();
    record._createdAt = timestamp;
    record._updatedAt = timestamp;
    record._id = GetPushId(writePath);
    var ref = db.ref(writePath + "/" + record._id);

    //  EXECUTE
    try {
        ref.set(record, function(error) {
            if (error) {
                console.log("Merchant Account Data could not be saved." + error);
              } else {
                console.log("Merchant Account Data saved successfully.");
              }
        });
        return record._id;
    } catch (error) {
        console.log('CreateMerchantChannelSeason error: ');
        return error;
    }
};

/*
*
*/  
async function CreateMerchentEventsBatch(merchantId, eventsArray) {
    //  NOTIFY
    //  LOCAL
    var writePath = 'Merchants/' + merchantId + '/Events';
    var ref = db.ref(writePath);
    var updates = _arrayToUpdate(eventsArray, writePath);

    //  EXECUTE
    try {
        ref.update(updates, function(error) {
            if (error) {
                console.log("Data could not be saved." + error);
              } else {
                console.log("Data saved successfully.");
              }
        })
    } catch (error) {
        console.log('CreateMerchentEventsBatch error: ');
        return error;
    }
};

/*
*   CREATE MERCHANT ASSET ACCOUNT
*/
async function CreateMerchantAssetAccount(path, data) {
    //  NOTIFY
    console.log('CreateMerchantAssetAccount: ', path);
    //  LOCAL
    //  execute
    try {
        await _set(path, data);
        console.log('DONE');
    } catch (error) {
        console.log('CreateMerchantAssetAccount error: ');
        console.error(error);
        return error;
    }
}

//  FUNCTION: TEST
async function test() {
    //  NOTIIFY PROGRESS
    console.log('this is the firebase test function');
    var ref = db.ref("test");
    ref.once("value", function(snapshot) {
    console.log(snapshot.val());
    });
};

/*
*   CREATE INVENTORY ROLE
*/
async function CreateInventoryRole(writePath, role) {
    //  NOITIFY
    //  LOCAL

    //  EXECTUE
    try {
        await _update(writePath, role);
        console.log('Created Inventory role at: ', writePath);
    } catch (error) {
        console.log('CreateInventoryRole Error: ');
        console.log(error);
    }
};

/*
*   CREATE INVENTORY GROUPS
*/
async function CreateInventoryGroups(writePath, group) {
    //  NOITIFY
    //  LOCAL

    //  EXECTUE
    try {
        await _update(writePath, group);
        console.log('Created Inventory group at: ', writePath);
    } catch (error) {
        console.log('CreateInventoryGroups Error: ');
        console.log(error);
    }
};

/*
*   CREATE INVENTORY ITEMS
*/
async function CreateInventoryItems(writePath, item) {
    //  NOITIFY
    //  LOCAL

    //  EXECTUE
    try {
        await _update(writePath, item);
        console.log('Created Inventory items at: ', writePath);
    } catch (error) {
        console.log('CreateInventoryItems Error: ');
        console.log(error);
    }
};

/*
*
*/
async function GetInventoryMfgSku(sku) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var readPath = "Inventory/MFG/" + sku;
    var ref = db.ref(readPath);

    //  EXECUTE
    try {
        return ref.once('value', function(snapshot) {
            console.log('got GetInventoryMfgSku snapshot');
        });
    } catch (error) {
        console.log('GetInventoryMfgSku Error: ', error);
    }
} 

/*
*
*/
async function GetInventoryMfgList() {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var readPath = 'Inventory/MFG';
    var ref = db.ref(readPath);

    //  EXECUTE
    try {
        return ref.once('value', function(snapshot) {
            console.log('got GetInventoryMfgList snapshot');
        });
    } catch (error) {
        console.log('GetInventoryMfgList error: ', error);
    }
};

/*
*
*/
async function GetDailyReports(reportsDate) {
    //  NOTIFY
    //  LOCAL
    var readPath = "Actualizations/Mfg"
    var ref = db.ref(readPath);
    var reportsQuery = ref.orderByChild('eventDate').equalTo(reportsDate);

    //  EXECUTE
    try {
        return reportsQuery.once("value", function(snapshot) {
            //console.log('got these reports');
            //console.log(snapshot.val());
        });
    } catch (e) {
       console.log("GetDailyReports Error: ", e); 
    }
}

/*
*
*/
async function CreateMfgReport(writePath, data) {
    //  NOITIFY
    //  LOCAL

    //  EXECTUE
    try {
        await _update(writePath, data);
        console.log('Created Mfg report at: ', writePath);
    } catch (error) {
        console.log('CreateInventoryItems Error: ');
        console.log(error);
    }   
}

/*
*
*/
async function GetMFGRecordByDevice(deviceId) {
    //  NOTIFY PROGRESS
    //  LOCAL 
    var ref = db.ref('Actualizations/Mfg');
    var reportsQuery = ref.orderByChild('device/id').equalTo(deviceId);

    //  EXECUTE
    try {
        reportsQuery.on("value", function(snapshot) {
            return snapshot.val();
        });
    } catch (error) {
        console.log('GetMFGRecordByDevice Error: ', error);
    }
};

/*
*
*/
async function UpdateMfgOrders(data) {
    //  NOTIFY PROGRESS
    //  LOCAL FUNCTIONS
    var updatePath = "Actualizations/Mfg/" + data.id + "/orders";

    //  EXECUTE
    try {
        var result = _update(updatePath, data.updates);
        return result;
    } catch (e) {
        console.log("UpdateMfgOrders Error: ", e);
    }
    
};

/*
*
*/
async function UpdateMfgSupplies(data) {
    //  NOTIFY PROGRESS
    //  LOCAL FUNCTIONS
    var updatePath = "Actualizations/Mfg/" + data.id + "/supplies";

    //  EXECUTE
    try {
        var result = _update(updatePath, data.updates);
        return result;
    } catch (e) {
        console.log("UpdateMfgOrders Error: ", e);
    }
    
};

//  EXPORT MODULE
module.exports = firebaseStOps;