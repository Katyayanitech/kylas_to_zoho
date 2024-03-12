const express = require("express");
const axios = require("axios");
const { postLeadToCRM } = require("../controller/lead.js");

const router = express.Router();

router.post('/kylas-Leads', postLeadToCRM);

module.exports = router;