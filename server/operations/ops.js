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
    Channels: {
        create: CreateChannel
    },
    Events: {
        createSeries: CreateSeriesOfEvents
    },
    Seasons: {
        create: CreateSeason
    }
};

//  EXECUTE

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

//  EXPORTS
module.exports = opsObject;

