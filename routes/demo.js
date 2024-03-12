const express = require("express");
const axios = require("axios");
const { postLeadToCRM } = require("../controller/lead.js");
const { printing } = require("../controller/demo.js");

const router = express.Router();

router.get('/kylas-demo', printing);


module.exports = router;
