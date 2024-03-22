const { PostBookToCRM } = require("../utils/invoiceHelper.js");

exports.postBookInvoiceToCRM = async (req, res) => {
    try {
        const invoiceData = req.body;
        await PostBookToCRM(invoiceData);
        return res.status(200).send('Contact processed successfully');
    } catch (error) {
        console.log('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}