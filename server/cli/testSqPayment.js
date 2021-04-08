/*
*
*
*/
//  NOTIFY PROGRESS
//  DEFINE DEPENDENCIES
var rcdPayment          = require('../automations/recordSquarePayment');

//  LOCAL VARIABLES
var paymentRecord = {
    "id": "hYy9pRFVxpDsO1FB05SunFWUe9JZY",
    "created_at": "2021-04-08T09:30:00-07:00",
    "updated_at": "2020-11-22T21:16:51.198Z",
    "amount_money": {
    "amount": 100,
    "currency": "USD"
    },
    "status": "APPROVED",
    "delay_duration": "PT168H",
    "source_type": "CARD",
    "card_details": {
    "status": "AUTHORIZED",
    "card": {
        "card_brand": "MASTERCARD",
        "last_4": "9029",
        "exp_month": 11,
        "exp_year": 2022,
        "fingerprint": "sq-1-Tvruf3vPQxlvI6n0IcKYfBukrcv6IqWr8UyBdViWXU2yzGn5VMJvrsHMKpINMhPmVg",
        "card_type": "CREDIT",
        "prepaid_type": "NOT_PREPAID",
        "bin": "540988"
    },
    "entry_method": "KEYED",
    "cvv_status": "CVV_ACCEPTED",
    "device_details": {
        'device_id': 'DEVICE_INSTALLATION_ID:C4F1253F-8969-4C88-B20D-4E89F622884D',
        'device_installation_id': 'C4F1253F-8969-4C88-B20D-4E89F622884D',
        'device_name': 'Red iPad'
    },
    "avs_status": "AVS_ACCEPTED",
    "statement_description": "SQ *DEFAULT TEST ACCOUNT",
    "card_payment_timeline": {
        "authorized_at": "2020-11-22T21:16:51.198Z"
    }
    },
    "location_id": "S8GWD5R9QB376",
    "order_id": "0HIY2T9rgTC0DQLsvXFyPMoeV",
    "risk_evaluation": {
    "created_at": "2020-11-22T21:16:51.198Z",
    "risk_level": "NORMAL"
    },
    "total_money": {
    "amount": 100,
    "currency": "USD"
    },
    "approved_money": {
    "amount": 100,
    "currency": "USD"
    },
    "capabilities": [
    "EDIT_TIP_AMOUNT",
    "EDIT_TIP_AMOUNT_UP",
    "EDIT_TIP_AMOUNT_DOWN"
    ],
    "receipt_number": "hYy9",
    "delay_action": "CANCEL",
    "delayed_until": "2020-11-29T21:16:51.086Z",
    "version_token": "FfQhQJf9r3VSQIgyWBk1oqhIwiznLwVwJbVVA0bdyEv6o"
};


//  EXECUTE
async function execute() {
    var result = await rcdPayment.usingPaymentId(paymentRecord)
    console.log(result); 
}

execute();

