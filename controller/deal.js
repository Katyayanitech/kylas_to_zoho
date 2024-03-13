const { PostDealzoho } = require("../utils/dealHelper");

exports.postDealToCRM = async (req, res) => {
    try {
        const newDeal = req.body;
        await PostDealzoho(newDeal);
        return res.status(200).send('Deal processed successfully');
    } catch (error) {
        console.error('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}