/*
*   OPERATIONS 
*/

//  DEFINE DEPENDENCIES
const { merchants } = require('../firebase/stdops.js');
var Firebase        = require('../firebase/stdops.js');
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
            create: CreateMfgReport
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
                        
                        const templateFile  = fs.readFileSync('./models/eventsTemplate.json', 'utf8');
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


//  EXPORTS
module.exports = opsObject;

