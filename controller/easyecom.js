const { postInvoiceToZohoBooks } = require("../utils/easyecomHelper.js");

exports.postInvoiceToBooks = async (req, res) => {
    try {
        const easyecomData = req.body;
        await postInvoiceToZohoBooks(easyecomData);
        return res.status(200).send('easyecom invoice processed successfully');
    } catch (error) {
        console.log('Error processing webhook request for easyecom:', error);
        return res.status(500).send('Error processing webhook request for easyecom');
    }
}