const { PostDealzoho, updateDealToZohoCRM } = require("../utils/dealHelper");

exports.postDealToCRM = async (req, res) => {
    try {
        const newDeal = req.body;
        console.log(`Deal data : ${JSON.stringify(newDeal)}`);
        await PostDealzoho(newDeal);
        return res.status(200).send('Deal processed successfully');
    } catch (error) {
        console.log('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}

exports.updateDealToCRM = async (req, res) => {
    try {
        const updatedDeal = req.body;
        console.log(`Deal Update data : ${JSON.stringify(updatedDeal)}`);
        await updateDealToZohoCRM(updatedDeal);
        return res.status(200).send('Deal Updated successfully');
    } catch (error) {
        console.log('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}