const { postLeadToZohoCRM } = require("../utils/leadHelper.js");

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