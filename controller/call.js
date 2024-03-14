const { PostCallzoho } = require("../utils/dealHelper");

exports.postCallToCRM = async (req, res) => {
    try {
        const newCall = req.body;
        await PostCallzoho(newCall);
        return res.status(200).send('Call processed successfully');
    } catch (error) {
        console.error('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}