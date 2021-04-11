/*
*   OPERATIONS 
*/

//  DEFINE DEPENDENCIES
const { merchants } = require('../firebase/stdops.js');
var Firebase        = require('../firebase/stdops.js');
const Square        = require('../square/stdops');
var moment          = require('moment');
const fs            = require('fs');

//  LOCAL VARIABLES
var opsObject = {
    Assets: {
        create: {
            SKUwithLocations: CreateSKUwithLocations
        }
    },
    Channels: {
        create: CreateChannel
    },
    Events: {
        createSeries: CreateSeriesOfEvents
    },
    Seasons: {
        create: CreateSeason
    },
    Inventory: {
        Roles: {
            create: CreateInventoryRole
        },
        Groups: {
            create: CreateInventoryGroups
        },
        Items: {
            create: createInventoryItems
        }
    },
    Actualizations: {
        Mfg: {
            create: CreateMfgReport,
            selectReportFromReports:    SelectMfgReportFromReports,
            buildOrderUpdates:          BuildMfgOrderUpdates,
            buildSuppliesUpdates:       BuildMfgSuppliesUpdates
        }
    }
};

//  EXECUTE

/*
*   PRIVATE: BUILD ASSET ACCTS
*/
function _buildAssetAccts(object) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var returnArray             = [];
    var parent = {
        id: "",
        name: ""
    };

    //  EXECUTE
    object.locations.forEach(function(location) {
        //  local variables
        var timestamp               = new Date(Date.now()).toISOString();
        const templateFile          = fs.readFileSync('./server/models/assetsTemplate.json', 'utf8');
        let templateAsset           = JSON.parse(templateFile);
        templateAsset._createdAt    = timestamp;
        templateAsset._updatedAt    = timestamp;
        templateAsset._createdBy    = 'admin';
        templateAsset._updatedBy    = 'admin';
        templateAsset._id           = Firebase.get.pushId();
        templateAsset.sku           = object.sku;
        templateAsset.serial        = object.serial;
        templateAsset.name          = object.name;
        templateAsset.type          = object.type;
        templateAsset.description   = object.description;
        templateAsset.detail_type   = object.detail_type;
        templateAsset.units         = object.units;
        templateAsset.txs[0].sku    = object.sku;
        templateAsset.txs[0].units  = object.units;
        var writePath               = "Merchants/-MVrZajcORbaTjkuZL2a/AssetAccts/" + templateAsset._id;
        
        if(location == "") {
            parent.id   = templateAsset._id;
            parent.name = templateAsset.name;
        } else {
            templateAsset._isSubAcct    = true;
            templateAsset._parentId     = parent.id;
            templateAsset._parentName   = parent.name;
            templateAsset.name = templateAsset.name + " - " + location;
        };

        returnArray.push(Firebase.merchants.assetAccts.create(writePath, templateAsset))
    });

    return returnArray;
};

/*
*
*/
async function CreateSKUwithLocations(SKU) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    var allPromises = _buildAssetAccts(SKU);

    //  EXECUTE
    try {
        var result = Promise.all(allPromises);
        return result;
    } catch (error) {
        console.log('CreateSKUwithLocations Error:');
        console.log(error);
    }
};

/*
*   CREATE CHANNELS
*/
async function CreateChannel(merchantId, record) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES
    //  EXECUTE
    try {
        return await Firebase.merchants.channels.create(merchantId, record);
    } catch (error) {
        console.log('CreateChannel Error:');
        console.log(error);
    }
};

/*
*   CREATE SEASONS
*/
async function CreateSeason(merchantId, channelId, record) {
    //  NOTIFY PROGRESS
    //  LOCAL VARIABLES

    //  EXECUTE
    try {
        //  GET THE CHANNEL
        var channelRecord = await Firebase.merchants.channels.get(merchantId, channelId);
        record.channelId    = channelRecord._id;
        record.channel      = channelRecord.name;

        //  CREATE THE SEASON
        return await Firebase.merchants.channels.seasons.create(merchantId, channelId, record);

    } catch (error) {
        console.log('CreateChannel Error:');
        console.log(error);
    }
};

/*
*   CREATE SERIES OF EVENTS
*/
async function CreateSeriesOfEvents(merchantId, channelId, seasonId, startsAt, isTemplate) {
    //  NOTIFY
    //  LOCAL VARIABLES
    var eventsArray = [];

    //  EXECUTE
    try {
        if(isTemplate) {
            //  1. COLLECT SEASON RECORD
            var seasonRecord = await Firebase.merchants.channels.seasons.get(merchantId, channelId, seasonId)
            console.log(seasonRecord);

            var frequency = seasonRecord.frequency
            
            switch(frequency) {
                case "weekly":
                    //  LOCAL VARIABLES

                    var i = 1;
                    for(var cursor = moment(seasonRecord.startsAt); cursor.isSameOrBefore(seasonRecord.endsAt); cursor = cursor.add(7, "days")) {
                        
                        const templateFile  = fs.readFileSync('../models/eventsTemplate.json', 'utf8');
                        let template = JSON.parse(templateFile);

                        //  ADD SEASON DETAILS
                        template.externalIds.seasonId   = seasonRecord._id;
                        template.season                 = seasonRecord.name

                        //  ADD CHANNEL DETAILS
                        template.externalIds.channelId  = seasonRecord.channelId;
                        template.channel                = seasonRecord.channel;

                        //  WEEK NUM
                        template.weekNum = cursor.isoWeek() + 1;

                        //  SCHEDULE
                        startTime = seasonRecord.template.startsAt;
                        endTime = seasonRecord.template.endsAt;
                        startTimeArray  = startTime.split(":");
                        endTimeArray    = endTime.split(":");
                        
                        var start = moment(cursor.format()).hour(startTimeArray[0]).minute(startTimeArray[1]);
                        var end = moment(cursor.format()).hour(endTimeArray[0]).minute(endTimeArray[1]);
                        
                        template.schedule.startsAt  = start.format();
                        template.schedule.endsAt    = end.format();
                        template.schedule.duration  = seasonRecord.template.durationHrs

                        //  INSTANCE
                        template.instance = i;

                        //  ADD TO ARRAY
                        eventsArray.push(template);

                        //  NOTIFY PROGRESS
                        console.log(cursor.format('YYYY-MM-DD'), i );

                        //  INCRIMENT COUNTER
                        i++;
                    };

                    //  NOTIFY RESULT
                    //console.log(eventsArray);
                    
                    return await Firebase.merchants.events.createBatch(merchantId, eventsArray);

                    break;
                default:
                    break;
            };
        } else {

        }

        //  NOTIFY RESULT
        
    } catch (error) {
        console.log('CreateSeriesOfEvents Error:');
        console.log(error);
    }
};

/*
*   CREATE INVENTORY ROLE
*/
async function CreateInventoryRole(role) {
    //  NOITIFY
    //  LOCAL
    var timestamp   = new Date(Date.now()).toISOString();
    let roleId      = Firebase.get.pushId();
    let writePath   = 'Inventory/Roles/' + roleId;
    role._createdAt = timestamp;
    role._updatedAt = timestamp;
    role._createdBy = "admin";
    role._updatedBy = "admin";
    role._id        = roleId;

    //  EXECTUE
    try {
        Firebase.Inventory.Roles.Create(writePath, role);
        return true;
    } catch (error) {
        console.log('CreateInventoryRole Error: ');
        console.log(error);
    }
};

/*
*   CREATE INVENTORY ROLE
*/
async function CreateInventoryGroups(group) {
    //  NOITIFY
    //  LOCAL
    var timestamp   = new Date(Date.now()).toISOString();
    let groupId      = Firebase.get.pushId();
    let writePath   = 'Inventory/Groups/' + groupId;
    group._createdAt = timestamp;
    group._updatedAt = timestamp;
    group._createdBy = "admin";
    group._updatedBy = "admin";
    group._id        = groupId;

    //  EXECTUE
    try {
        Firebase.Inventory.Groups.Create(writePath, group);
        return true;
    } catch (error) {
        console.log('CreateInventoryGroups Error: ');
        console.log(error);
    }
};

/*
*   CREATE INVENTORY ITEM
*/
async function createInventoryItems(item) {
    //  NOITIFY
    //  LOCAL
    var timestamp   = new Date(Date.now()).toISOString();
    let itemId      = Firebase.get.pushId();
    let writePath   = 'Inventory/Items/' + itemId;
    item._createdAt = timestamp;
    item._updatedAt = timestamp;
    item._createdBy = "admin";
    item._updatedBy = "admin";
    item._id        = itemId;

    //  EXECTUE
    try {
        Firebase.Inventory.Items.Create(writePath, item);
        return true;
    } catch (error) {
        console.log('CreateInventoryItems Error: ');
        console.log(error);
    }
};

/*
*
*/
async function CreateMfgReport(data) {
    //  NOTIFY PROGRESS

    //  LOCAL VARIABLES
    var timestamp   = new Date(Date.now()).toISOString();
    let reportId    = Firebase.get.pushId();
    let writePath   = 'Actualizations/Mfg/' + reportId;
    data._createdAt = timestamp;
    data._updatedAt = timestamp;
    data._createdBy = "admin";
    data._updatedBy = "admin";
    data.id         = reportId;

    //  EXECUTE
    try {
        Firebase.Actualizations.Mfg.createReport(writePath, data);
    } catch (error) {
        console.log("Error: ", error);
    }
};

/*
*
*/
function SelectMfgReportFromReports(payment, reports) {
    //  NOTIFY PROGRESS
    //console.log("SelectMfgReportFromReports: ");
    //console.log("payment: ", payment);
    //console.log("reports: ", reports)
    
    //  LOCAL VARIABLES
    var targetKey   = "";

    //  FIND THE DEVICE DETAILS
    if(payment.card_details.device_details != undefined) {
        var device = payment.card_details.device_details;
        if(device.device_installation_id != undefined) {
            var deviceId = device.device_installation_id
        } else {
            if(device.device_name != undefined) {
                var deviceName = device.device_name
            } else {
                var deviceName = "";
            }
        }
        if(device.device_name != undefined) {
            var deviceName = device.device_name
        } else {
            var deviceName = "";
        }
    } else {
        deviceId = "";
    }
    console.log("Device Details: ", deviceId, deviceName);

    //  FIND THE EMPLOYEE DETAILS
    if(payment.employee_id != undefined) {
        var employeeId  = payment.employee_id;
    } else {
        var employeeId  = "";
    }
    console.log("Employee Details: ", employeeId);

    //  EXECUTE BASED ON FINDINGS
    if(deviceId != "") {
        //  FIRST TRY USING THE DEVICE ID
        
        Object.keys(reports).forEach(function(key) {
            console.log(key, reports[key].device.id, deviceId && deviceId != "");
            if(reports[key].device.id == deviceId) {
                targetKey = key;
                console.log('device id match');
            } else if(reports[key].device.name == deviceName && deviceName != "") {
                targetKey = key;
                console.log('device name match');
            } else if(reports[key].assignedTo.id == employeeId && employeeId != "") {
                targetKey = key;
                console.log('employee name match', reports[key].assignedTo.id, employeeId);
            } 
        });
        console.log('targetKey: ', targetKey);

        //  ONLY REUTRN GOOD VALUE
        if(targetKey == "") {
            
        } else {
            return reports[targetKey];
        }

    } else if(deviceName != "") {
        //  NEXT TRY USING THE DEVICE NAME
        
    } else if(employeeId != "") {
        //  THEN TRY USING THE EMPLOYEE ID

    } else {
        //  IF ALL THAT FAILS, WE'LL HAVE TO CREATE A NEW ANONOMUS RECORD
    }

};

/*
*
*/
async function BuildMfgOrderUpdates(payment, report) {
    //  NOTIFY PROGRESS
    //console.log('BuildMfgOrderUpdates: ', payment);
    
    //  LOCAL VARIABLES
    var itemsList    = [];
    var returnObject = {
        id: report.id,
        oldsupplyLevels: report.supplies,
        updates: {}
    };

    //  ITERATE OVER SQUARE ORDER ITEMS ARRAY, ADD ALL CATALOGY ID'S TO THE LIST TO COLLECT
    payment.order.lineItems.forEach(function(item) {
        //  NOTIFY PROGRESS
        //console.log('PAYMENT Line Item: ', item);
        
        //  LOCAL VARIABLES
        var timestamp = moment().format();

        //  ADD OBJECT TIMESTAMP AND NEW VALUES
        returnObject.updates[timestamp] = {
            description: "",
            qty: parseInt(item.quantity),
            sku: "",
            squareCatalogId: item.catalogObjectId,
            updates: ""
        }; 

        //add the catalog Id to the list for square
        itemsList.push(item.catalogObjectId);

    });

    var squareCatalogue     = await Square.items.catalog.batchList(itemsList);
    //console.log("objects: ", squareCatalogue.objects);
    //console.log('relatedObjects: ', squareCatalogue.relatedObjects);

    //  ITERATE OVER PARALLEL SQUARE ITEMS
    for(var i = 0; i < squareCatalogue.objects.length; i++) {

        //  LOCAL VARIABLES
        var sku                 = squareCatalogue.objects[i].itemVariationData.sku;
        var mfgObjectSnapshot   = await Firebase.Inventory.MFG.get(sku);
        var mfgObject           = mfgObjectSnapshot.val();

        //  ITERATE OVER THE UPDATE OJBECTS
        Object.keys(returnObject.updates).forEach(function(timestamp) {
            //  NOTIFY PROGRESS
            //  LOCAL VARIABLES
            var sqCatId = returnObject.updates[timestamp].squareCatalogId;

            //  MAKE SURE THE SQUAR CATEGORY IDS MATCH
            if(sqCatId == squareCatalogue.objects[i].id && sqCatId != '') {

                returnObject.updates[timestamp].description = squareCatalogue.relatedObjects[i].itemData.name;
                returnObject.updates[timestamp].sku         = sku
                returnObject.updates[timestamp].updates     = mfgObject.components
            };

        });

    };
    
    

    //  EXECUTE
    return returnObject;
};

/*
*
*/
function BuildMfgSuppliesUpdates(orderUpdates) {
    //  NOTIFY PROGRESS
    //console.log('BuildMfgSuppliesUpdies:');
    //console.log("payment: ", payment);
    //console.log("report: ", report);

    //  LOCAL VARIABLES
    var returnObject = {
        id: orderUpdates.id,
        updates: {}
    };

    //  EXTRACT THE TIME STAMP
    Object.keys(orderUpdates.updates).forEach(function(timestamp) {
        //  NOTIFY PROGRESS
        //  LOCAL VARIABLES
        var updates     = orderUpdates.updates[timestamp].updates;
        var multiplier  = orderUpdates.updates[timestamp].qty;

        //  ITERATE OVER UPDATES
        Object.keys(updates).forEach(function(key) {
            
            //  NOTIFY PROGRESS
            //console.log('orderUpdates.updates ', key, updates[key]);
            console.log('orderUpdates.oldsupplyLevels[key]: ', key, orderUpdates.oldsupplyLevels[key])
            
            // LOCAL VARIABLES
            var writePath = key + "/qty"
            var delta = parseInt(updates[key]) * multiplier;
            
            if(orderUpdates.oldsupplyLevels[key] != undefined) {
                //  LOCAL VARIABLES
                var oldItemSupplyLevel = orderUpdates.oldsupplyLevels[key].qty;

                //  notify progres
                //console.log('oldItemSupplyLevel: ', oldItemSupplyLevel);

                //  If the key isn't present yet, create it
                if(returnObject.updates[writePath] == undefined) {
                    returnObject.updates[writePath] = oldItemSupplyLevel;
                }

                //console.log('delta: ', delta);

                //  add the new update value to the old value
                returnObject.updates[writePath] += delta;

            }
            
        });

    });

    //  EXECUTE
    return returnObject;
};


//  EXPORTS
module.exports = opsObject;

