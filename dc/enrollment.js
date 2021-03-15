/*
*   DELIGHT CIRCLE ENROLLMENT MODULE  
*/
//  DEFINE DEPENDENCIES


//  DEFINE MODULE
var dcEnrollment = {
    enrollmentInvite: {
        viaSMS: EnrollmentInviteViaSMS
    } 
};

/*
*   DELIGHT CIRCLE ENROLLMENT INVITE VIA SMS
*
*
*   @param(sqLyltyId) - String: '664c22ba-9460-45a5-8917-381ae72dcfdc'   
*   @param(phone) - String: "+15555555555" 12 character
*   @return(status) - Bool: Success | Failure
*/
async function EnrollmentInviteViaSMS(sqLyltyId, phone) {
    //  NOTIFY PROGERSS
    console.log('EnrollmentInviteViaSMS: sqLyltyId("', sqLyltyId, '", phone("', phone, '"');

    //  1. Check for existing customer record with that phone
    //  2. 

    //  DEFINE LOCAL VARIABLES
    return true;
}

//  EXPORT MODULE
module.exports = dcEnrollment