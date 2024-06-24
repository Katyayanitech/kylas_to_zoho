const { json } = require("express");
const twilio = require('twilio');
const { postLeadToZohoCRM, updateLeadToZohoCRM } = require("../utils/leadHelper.js");

const accountSid = '';
const authToken = '';
const client = new twilio(accountSid, authToken);

exports.postLeadToCRM = async (req, res) => {
    try {
        const newLead = req.body;
        console.log(`New Lead Log ${newLead}`);
        await postLeadToZohoCRM(newLead);
        return res.status(200).send('Lead processed successfully');
    } catch (error) {
        console.log('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}

const sendSMSErrorMessage = (errorMessage) => {
    const message = `Error processing webhook request for Lead: ${errorMessage}`;
    client.messages.create({
        body: message,
        from: '+18777804236',
        to: '+918839782589' 
    }).then(message => console.log(`SMS sent: ${message.sid}`))
    .catch(error => console.log('Error sending SMS:', error));
};

exports.updateLeadToCRM = async (req, res) => {
    try {
        const updatedLead = req.body;
        console.log(`Lead Update Log ${JSON.stringify(updatedLead)}`);
        await updateLeadToZohoCRM(updatedLead);
        sendSMSErrorMessage(`Lead Data ${updatedLead}`)
        res.status(200).send('Lead Update successfully');
    } catch (error) {
        console.log('Error processing webhook request for Lead :', error);
        sendSMSErrorMessage(error.message);
        res.status(200).json({ message: 'Error processing Update webhook request', error: error.message });
    }
}