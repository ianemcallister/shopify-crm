/*
*   WEBHOOK ROUTES MODULE
*/

module.exports = (function() {
    'use strict';
    //  DEFINE DEPENDENCIES
    var webhookRoutes   = require('express').Router();
    //var Delightcircle   = require('../crm/delightCircle.js');
    //var CKC_StanOps     = require('../crm/standardOps.js');

    //  TEST
    webhookRoutes.get('/test', function(req, res) {

        //  NOTIFY PROGRESS
        console.log('received this test webhook');
        console.log(req.body);

        res.sendStatus(200);
    });

    //	POST: /sqrwebhook
    webhookRoutes.post('/square', async function(req, res) {
        
        //advise of the post body
        console.log(req.body);

        try {
            
            // work through various options
            if(req.body.type == "loyalty.account.created") {
                //  NOTIFY PROGRESS
                console.log('A loyalty account was created');

                //  use the hoook to get the loyalty acct and the phone #
                //  use the loyalty acct to get the customer acct
                //  invite them via text to setup their loyalty acct
                //  if they don't within 24hrs end them a generic code
                //  generate the code and redirect via shopify
                //  save the code and redirect in their customer profile

                //var customerPhones = ckccrm.extractPhone(req.body.data.object.loyalty_account.mappings);
                //customerPhones.push('+15034513575');    //  REMOVE THIS LATER
                //var result = await ckccrm.EnrollReferalCustomer(req.body.data.id, customerPhones); 
                //console.log(result);
                //console.log('enrolling this customer', customerPhones);
                res.sendStatus(200);
            } else if(req.body.type == "payment.created") {
                //  DEFINE LOCAL VARIABLES
                var paymentId = req.body.data.object.payment.id;

                //  NOTIFY PROGRESS
                console.log('a payment was created');

                //var result = await CKC_StanOps.Touchpoints.Record({type: "payment", id: paymentId, source: "square"})

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