const express = require("express");
const { postCreditnoteToBooks } = require("../controller/easyecomcreditnote.js");

const router = express.Router();

router.post('/easyecom-creditnote', postCreditnoteToBooks);

module.exports = router;