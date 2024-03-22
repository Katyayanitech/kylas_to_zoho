const express = require("express");
const { postBookInvoiceToCRM } = require("../controller/invoice");

const router = express.Router();

router.post('/kylas-Contacts', postBookInvoiceToCRM);

module.exports = router;