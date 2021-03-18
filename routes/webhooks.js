/*
*   WEBHOOK ROUTES MODULE
*/

module.exports = (function() {
    'use strict';
    //  DEFINE DEPENDENCIES
    var webhookRoutes       = require('express').Router();
    var rewards             = require('../rewards/enrollment.js');

    function _parseMappings(mappings) {
        //  NOTIFY PROGRESS
        console.log('Parsing Mappings ', mappings);

        //  DEFINE LOCAL VARIABLES
        var returnObject = {};

        //  Iterate over object
        mappings.forEach(function(mapping) {
            returnObject[mapping.type] = mapping.value;
        });

        //  NOTIFY PROGRESS
        console.log('Mapping Object: ', returnObject);

        //  RETURN
        return returnObject;
    };

    //  TEST
    webhookRoutes.get('/test', function(req, res) {

        //  NOTIFY PROGRESS
        console.log('received this test webhook');
        console.log(req.body);

        res.sendStatus(200);
    });

    //	POST: /sqrwebhook
    webhookRoutes.post('/square', async function(req, res) {
        
        //  NOTIFY POST DATA
        console.log(req.body);
        
        //  DEFINE LOCAL VARIABLES
        var sq_merchant_id = req.body.merchant_id;
        var timestamp = req.body.data.created_at;
        var data = req.body.data.object;

        try {
            
            // work through various options
            if(req.body.type == "loyalty.account.created") {
                //  NOTIFY PROGRESS
                console.log('loyatly account created');
                console.log(data.loyalty_account);

                //  DEFINE LOCAL VARAIBLES
                var mapping             = _parseMappings(data.loyalty_account.mappings);
                var merchCustPhone      = mapping.PHONE;
                var merchCustloyaltyId  = data.loyalty_account.id;

                //  1. RECORD TOUCHPOINT

                //  2. CONFIRM PRESENCE OF PHONE NUMBER
                if(merchCustPhone != undefined) {
                    //  NOTIFY PROGRESS
                    console.log('phone # found', merchCustPhone);

                    //  3.2 INVITE CUSTOMER TO REFERRAL PROGRAM 
                    await rewards.enrollmentInvite.viaSMS(merchCustPhone, merchCustloyaltyId, sq_merchant_id, timestamp);
                    console.log('proccessed enrollment: ', merchCustPhone);
                }

                //  3.1 RETURN
                res.sendStatus(200);
            } else if(req.body.type == "loyalty.account.deleted"){
                //  NOTIFY PROGRESS
                console.log('loyalty account deleted');
                console.log(data.loyalty_account);

                //  DEFINE LOCAL VARAIBLES

                //  RETURN
                res.sendStatus(200);
            } else if(req.body.type == "loyalty.account.updated"){
                //  NOTIFY PROGRESS
                console.log('loyalty account updated');
                console.log(data.loyalty_account);

                //  DEFINE LOCAL VARAIBLES

                //  RETURN
                res.sendStatus(200);
            } else if(req.body.type == "loyalty.event.created"){  
                //  NOTIFY PROGRESS
                console.log('loyalty event ceated');
                console.log(data.loyalty_event);  

                //  DEFINE LOCAL VARAIBLES

                //  RETURN
                res.sendStatus(200);
            } else if(req.body.type == "payment.created") {
                 //  NOTIFY PROGRESS
                 console.log('payment created');
                 console.log(data.payment); 

                //  DEFINE LOCAL VARIABLES
                var paymentId = data.payment.id;

                res.sendStatus(200);
            } else {
                res.sendStatus(200);
            }
            

        } catch (error) {
            console.log(error);
            res.sendStatus(400);
        } 

    });

    return webhookRoutes;
})();