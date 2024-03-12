const { Postcontactzoho } = require("../utils/contactHelper.js");

exports.postContactToCRM = async (req, res) => {
    try {
        const newcontact = req.body;
        await Postcontactzoho(newcontact);
        return res.status(200).send('Contact processed successfully');
    } catch (error) {
        console.error('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}