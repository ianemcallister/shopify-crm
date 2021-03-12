/*
*   INDEX.JS
*
*   This is the index file that everything runs off of.
*
*/

//  DEFINE DEPENDENCIES
const crypto        = require('crypto');
const nonce         = require('nonce')();
const request       = require('request-promise');
const querystring   = require('querystring');
const cookie        = require('cookie');
const express 		= require('express');

//return the express object
var serverApp = express();

//environment variables
var port = process.env.PORT || 3000;

//get the URL encoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

/*
*	USE Declarations
*
*/
//define our body parsers
serverApp.use(jsonParser); // for parsing application/json
serverApp.use(urlencodedParser); // for parsing application/x-www-form-urlencoded

//serve up a static asset
serverApp.use(express.static('dist'));

//track URL requests
serverApp.use('/', function(req, res, next) {
	//log the url to the console
	console.log('Request Url: ' + req.url);

	next();
});

//	ROUTING
/*
*	To clean up the code we've moved it to externl files
*/
//	WEBHOOK ROUTES
var webhookRoutes = require('./routes/webhooks');
serverApp.use('/webhook', webhookRoutes);

//	STANDARD GET
serverApp.get('/', async function(req, res) {
	//  DEFINE LOCAL VARIABLES

	//  NOTIFY PROGRESS
	console.log(req.query);

	res.send("CKC CRM");
})


/*
*	Opening Up the server
*/
//open the port for local development
serverApp.listen(port,function() {
	//display the port
	console.log('Express server is up and running on port ' + port);
	//identify the environment
	if(process.env.IS_PROUDCTION == 'true') {
		console.log('is production');
		//console.log('got these codes:', JSON.parse(process.env.PROMO_CODES));
	} else {
		console.log('is development');
		//console.log(JSON.parse(process.env.PROMO_CODES));
	}
});

