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
var TILL_URL = url.parse(process.env.TILL_URL);
var TILL_BASE = TILL_URL.protocol + "//" + TILL_URL.host;
var TILL_PATH = TILL_URL.pathname;

if(TILL_URL.query != null) {
  TILL_PATH += "?"+TILL_URL.query;
};

/*
*   SEND ENROLLMENT INVITE
*/
async function SendEnrollmentInvite(phone, enrollmenturl) {
    //  NOTIFY PROGRESS

    //  DEFEIN LOCAL VARABIELS

    //  RETURN
    return true;
};

//  EXPORT MODULE
module.exports = tillEnrollment;