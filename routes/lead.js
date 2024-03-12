const express = require("express");
const { postLeadToCRM, updateLeadToCRM } = require("../controller/lead.js");

const router = express.Router();

router.post('/kylas-Leads', postLeadToCRM);

router.post('/kylas-Leads-update', updateLeadToCRM);

module.exports = router;