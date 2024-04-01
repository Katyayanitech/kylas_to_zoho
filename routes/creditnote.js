const express = require("express");
const { postCreditNoteToCRM } = require("../controller/creditnote");

const router = express.Router();

router.post('/zohobook-creditnote', postCreditNoteToCRM);

module.exports = router;