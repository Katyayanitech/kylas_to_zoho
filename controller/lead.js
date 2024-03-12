const { postLeadToZohoCRM, updateLeadToZohoCRM } = require("../utils/leadHelper.js");

exports.postLeadToCRM = async (req, res) => {
    try {
        const newLead = req.body;
        await postLeadToZohoCRM(newLead);
        return res.status(200).send('Lead processed successfully');
    } catch (error) {
        console.error('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}

exports.updateLeadToCRM = async (req, res) => {
    try {
        const updatedLead = req.body;
        await updateLeadToZohoCRM(updatedLead);
        return res.status(200).send('Lead Update successfully');
    } catch (error) {
        console.error('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}