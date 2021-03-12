/*
*   INDEX.JS
*
*   This is the index file that everything runs off of.
*
*/

//  DEFINE DEPENDENCIES
const crypto        = require('crypto');
const nonce         = require('nonce')();
const bodyParser	= require('body-parser');
const querystring   = require('querystring');
const cookie        = require('cookie');
const express 		= require('express');
//const request       = require('request-promise');

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
//var webhookRoutes = require('./routes/webhooks');
//serverApp.use('/webhook', webhookRoutes);

//	STANDARD GET
serverApp.get('/', async function(req, res) {
	//  DEFINE LOCAL VARIABLES

	//  NOTIFY PROGRESS
	console.log(req.query);

	res.send("CKC CRM");
});

//	SHOPIFY GET
serverApp.get('/shopify', async function(req, res) {
	//	DEFINE LOCAL VARIABLES
	const shopName = req.query.shop; // Shop Name passed in URL

	if (shopName) {
        const shopState = nonce();
        const redirectUri = process.env.TUNNEL_URL + '/shopify/callback'; // Redirect URI for shopify Callback
        const installUri = 'https://' + shopName +
            '/admin/oauth/authorize?client_id=' + process.env.SHOPIFY_API_KEY +
            '&amp;scope=' + process.env.SCOPES +
            '&amp;state=' + shopState +
            '&amp;redirect_uri=' + redirectUri; // Install URL for app install
 
        res.cookie('state', shopState);
        res.redirect(installUri);
    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }

	//	NOIFTY PROGRESS
	console.log('in shopify endpoint');

	//	send response
});


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

