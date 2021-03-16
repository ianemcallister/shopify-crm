/*
*   OMNI CRM ROUTING
*/

module.exports = (function() {
    'use strict';
    //  DEFINE DEPENDENCIES
    var omniCRMRoutes       = require('express').Router();

    /*
    *   GET /
    */
    omniCRMRoutes.get('/', function(req, res) {
        res.sendStatus(200);
    });

    /*
    *   POST /
    */
    omniCRMRoutes.post('/', function(req, res) {
        res.sendStatus(200);
    });

    /*
    *   GET /
    */
    omniCRMRoutes.get('/', function(req, res) {
        res.sendStatus(200);
    });

    /*
    *   POST /
    */
    omniCRMRoutes.post('/enroll-customer', function(req, res) {
        //  validate sender
        var params = req.params;
        var query = req.query;
        var payload = req.body;

        console.log('got these params: ', params);
        console.log('got these queries: ', query);
        console.log('got this data: ', payload);

        res.sendStatus(200);
    });

    
    return omniCRMRoutes;
})();
