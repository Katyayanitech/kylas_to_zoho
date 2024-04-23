const { postLeadToZohoCRM, updateLeadToZohoCRM } = require("../utils/leadHelper.js");

exports.postLeadToCRM = async (req, res) => {
    try {
        const newLead = req.body;
        await postLeadToZohoCRM(newLead);
        return res.status(200).send('Lead processed successfully');
    } catch (error) {
        console.log('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}

exports.updateLeadToCRM = async (req, res) => {
    try {
        const updatedLead = req.body;
        console.log('Kylas Body : ', updatedLead);
        console.log('lead type: ', updatedLead.entity.customFieldValues.leadType.value);
        // console.log('lead type value: ', updatedLead.entity.customFieldValues.leadType.value);
         console.log('lead type Category: ', updatedLead.entity.customFieldValues.cfLeadCategory);
        
        await updateLeadToZohoCRM(updatedLead);
        return res.status(200).send('Lead Update successfully');
    } catch (error) {
        console.log('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}
