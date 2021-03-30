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
const fetch			= require('node-fetch');
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
var webhookRoutes = require('./routes/webhooks');
serverApp.use('/webhooks', webhookRoutes);

//	OMNI-CRM ROUTES
var omniCRMRoutes = require('./routes/omniCRM');
serverApp.use('/omni-crm', omniCRMRoutes);

//	STANDARD GET
serverApp.get('/', async function(req, res) {
	//  DEFINE LOCAL VARIABLES

	//  NOTIFY PROGRESS
	console.log(req.query);

	res.sendStatus(200);
});

//	SHOPIFY GET
serverApp.get('/shopify', async function(req, res) {
	//	DEFINE LOCAL VARIABLES
	const shopName = req.query.shop; // Shop Name passed in URL

	//	NOIFTY PROGRESS
	console.log('in shopify endpoint');

	//	response
	if (shopName) {
        const shopState = nonce();
        const redirectUri = process.env.CKCCRM_REDIRECT_URL + '/shopify/callback'; // Redirect URI for shopify Callback
        const installUri = 'https://' + shopName +
            '/admin/oauth/authorize?client_id=' + process.env.CKCCRM_SHOPIFY_API_KEY +
            '\&scope=' + 'write_orders,read_customers' + //process.env.SCOPES +
            '\&state=' + shopState +
            '\&redirect_uri=' + redirectUri; // Install URL for app install
		
		//	NOTIFY PROGRESS
        console.log("REDIRECTING TO: ",installUri, shopState);
		res.cookie('state', shopState);
        res.redirect(installUri);
    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
	
});

//	SHOPIFY TEST
serverApp.post('/shopify/api', async function(req, res) {
	//	define local variables
	//	NOTIFY PROGRESS
	console.log('got this reqest to shopify api: ', req.query);
	console.log('body: ', req.body);
	console.log('params: ', req.params);

	res.sendStatus(200);
});

//	SHOPIFY GET CALLBACK
serverApp.get('/shopify/callback', async function(req, res) {
	//	NOTIFY PROGRESS
	console.log('callback received this request: ', req);
	//	DEFINE LOCAL VARIABLES
	const shopName 	= req.query.shopName;
	const hmac 		= req.query.hmac;
	const code		= req.query.code;
	const shopState = req.query.shoState;
	const stateCookie = cookie.parse(req.headers.cookie).state;
    
	//	NOTIFY PROGRESS
	console.log(shopState + stateCookie);

	if (shopState !== stateCookie) {
        return res.status(403).send('Request origin cannot be verified');
    }

	if(shopName && hmac && code) {
		//	DEFINE LOCAL VARIABLES
		const map = Object.assign({}, req.query);
		delete map['signature'];
		delete map['hmac'];
		const message = querystring.stringify(map);
		const providedHmac = Buffer.from(hmac, 'utf-8');
		const generatedHash = Buffer.from(
            crypto
            .createHmac('sha256', process.env.CKCCRM_SHOPIFY_API_SECRET)
            .update(message)
            .digest('hex'),
            'utf-8'
        );
		let hashEquals = false;

		try {
            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
        } catch (e) {
            hashEquals = false;
        };

		if (!hashEquals) {
            return res.status(400).send('HMAC validation failed');
        }
		const accessTokenRequestUrl = 'https://' + shopName + '/admin/oauth/access_token';
        const accessTokenPayload = {
            client_id: process.env.CKCCRM_SHOPIFY_API_KEY,
            client_secret: process.env.CKCCRM_SHOPIFY_API_SECRET,
            code,
        };
		fetch(accessTokenRequestUrl, { method: 'POST', json: accessTokenPayload})
		.then(function(accessTokenResponse) {
			const accessToken = accessTokenResponse.access_token;
			const shopRequestUrl = 'https://' + shopName + '/admin/api/2019-07/shop.json';
			const shopRequestHeaders = {
				'X-Shopify-Access-Token': accessToken,
			};

			//	NOTIFY PROGRESS
			console.log('accessToken: ', accessToken);

			fetch(shopRequestUrl, {method: 'GET', headers: shopRequestHeaders })
			.then(function(shopResponse) {
				res.redirect('https://' + shopName + '/admin/apps');
			})
			.catch(function(error) {
				res.status(error.statusCode).send(error.error.error_description);
			});
		})
		.catch(function(error) {
			res.status(error.statusCode).send(error.error.error_description);
		})
	} else {
		res.status(400).send('Required parameters missing');
	}
	
});

serverApp.get('/config/firebase', async function(req, res) {
	//	NOTIFY
	//	LOCAL
	var returnString = "";

	returnString += "var config = {";
	returnString += "apiKey: '"              + process.env.CKCCRM_FIREBASE_WEB_APP_API_KEY   	+ "',";
	returnString += "authDomain: '"          + process.env.CKCCRM_FIREBASE_WEB_APP_AUTH_DOMAIN  + "',";
	returnString += "databaseURL: '"         + process.env.CKCCRM_FIREBASE_WEB_APP_DB_URL       + "',";
	returnString += "projectId: 'shopify-crm-app',";
	returnString += "storageBucket: 'shopify-crm-app.appspot.com',";
	returnString += "messagingSenderId: '567321093127',";
	returnString += "appId: '"   			 + process.env.CKCCRM_FIREBASE_WEB_APP_APP_ID    	+ "',";
	returnString += "measurementId: 'G-STKPRK5YCK'};";
	returnString += "firebase.initializeApp(config);";

	//advise of the post body
	//console.log('firebase config GET', returnString);

	res.status(200);
	res.send(returnString);
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
