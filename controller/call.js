const { PostCallzoho } = require("../utils/callHelper.js");


exports.postCallToCRM = async (req, res) => {
    try {
        const newCall = req.body;
        await PostCallzoho(newCall);
        return res.status(200).send('Call processed successfully');
    } catch (error) {
        console.log('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}