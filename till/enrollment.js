/*
*   TILL ENROLLMENT MODULE
*/

//  DEFINE DEPENDENCIES
var request     = require("request-json");
var url         = require("url");

//  DEFINE MODULE
var tillEnrollment = {
    send: {
        enrollmentInvite: SendEnrollmentInvite
    }
};

//  INITIATE INSTANCE
var TILL_URL = url.parse(process.env.SHOPIFY_CRM_TILL_URL);
var TILL_BASE = TILL_URL.protocol + "//" + TILL_URL.host;
var TILL_PATH = TILL_URL.pathname;

if(TILL_URL.query != null) {
  TILL_PATH += "?"+TILL_URL.query;
};

/*
*   PRIVATE: CREATE CLIENT
*/
async function _createClient(phones, questions, conclusion) {
    //  NOTIFY PROGRESS
    console.log('till/enrollment/_createClient: ', phones, questions, conclusion);

    request.createClient(TILL_BASE).post(TILL_PATH, {
        phone: phones,
        questions: questions,
        conclusion: conclusion
    }, function(err, res, body) {
        if(err != null) {
            console.log('Till/_createClient error: ', err);
        }
        console.log(res, body);

        return;
    });
};

/*
*   PRIVATE: SEND ALERT
*/
async function _sendAlert(phones, message) {
    //  NOTIFY
    console.log('till/enrollment/_sendAlert', phones, message);

    request.createClient(TILL_BASE).post(TILL_PATH, {
        phone: phones,
        text: message
      }, function(err, res, body) {
          //    NOTIFY
          console.log();

          if(err != null) { console.log('till/enrollment/_zendAlert error: ', err); }
          else { return res.statusCode } 
      });
};

/*
*   SEND ENROLLMENT INVITE
*/
async function SendEnrollmentInvite(phone, enrollmenturl) {
    //  NOTIFY PROGRESS
    console.log('till/enrollment/SendEnrollmentInvite', phone, enrollmenturl);

    //  DEFINE LOCAL VARABIELS
    var phones = [process.env.BIZ_PHONE];
    phones.push('+13237884533');
    //phones.push(phone);
    /*var questions = [{
        text: 'Welcome to SMS messages from 29 Kettle. We\'re excited you\'ve joined the Delight Circle Rewards Program. To finish your enrollment and start earning $5 everytime you refere someone to 29 Kettle, follow this link below: ' + enrollmenturl,
        tag: "enrollment",
        responses: ["HELP", 'END'],
        webhook: ""
    }];
    var conclusion = ""*/
    var message = 'Welcome to SMS messages from 29 Kettle. We\'re excited you\'ve joined the Delight Circle Rewards Program. To finish your enrollment and start earning $5 everytime you refere someone to 29 Kettle, follow this link below: ' + enrollmenturl;

    try {
        return await _sendAlert(phones, message)
    } catch (error) {
        console.log('till/enrollment/SendEnrollmentInvite error: ', error);
    }
    //  RETURN
    return true;
};

//  EXPORT MODULE
module.exports = tillEnrollment;