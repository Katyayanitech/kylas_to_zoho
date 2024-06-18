const { deleteInvoiceToZohoCRM } = require("../utils/inoviceHelper.js");

exports.deleteInvoiceToCrm = async (req, res) => {
    try {
        const invoice = req.body;
        await deleteInvoiceToZohoCRM(invoice);
        return res.status(200).send('Invoice Delete successfully');
    } catch (error) {
        console.log('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}