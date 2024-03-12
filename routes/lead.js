const express = require("express");
const { postLeadToCRM } = require("../controller/lead.js");

const router = express.Router();

router.post('/kylas-Leads', postLeadToCRM);

module.exports = router;