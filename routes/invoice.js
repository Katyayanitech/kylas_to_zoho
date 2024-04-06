const express = require("express");
const { deleteInvoiceToCrm } = require("../controller/invoice.js");

const router = express.Router();

router.post('/invoice-delete', deleteInvoiceToCrm);

module.exports = router;