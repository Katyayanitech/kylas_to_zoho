const { postCreditnoteToZohoBooks } = require("../utils/easyecomCreditnoteHelper.js");

exports.postCreditnoteToBooks = async (req, res) => {
    try {
        const easyecomCreditnoteData = req.body;
        await postCreditnoteToZohoBooks(easyecomCreditnoteData);
        return res.status(200).send('easyecom creditnote processed successfully');
    } catch (error) {
        console.log('Error processing webhook request for easyecom creditnote:', error);
        return res.status(500).send('Error processing webhook request for easyecom creditnote');
    }
}