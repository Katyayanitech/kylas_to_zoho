const { PostCreditBookToCRM } = require("../utils/creditnoteHelper");

exports.postCreditNoteToCRM = async (req, res) => {
    try {
        const creditnoteData = req.body;
        await PostCreditBookToCRM(creditnoteData);
        return res.status(200).send('Credit Note processed successfully');
    } catch (error) {
        console.log('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}