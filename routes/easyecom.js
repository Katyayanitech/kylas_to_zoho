const express = require("express");
const { postInvoiceToBooks } = require("../controller/easyecom.js");

const router = express.Router();

router.post('/easyecom-invoice', postInvoiceToBooks);

module.exports = router;