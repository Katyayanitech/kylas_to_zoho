const express = require("express");
const { postCallToCRM } = require("../controller/call");

const router = express.Router();

router.post('/kylas-Calls', postCallToCRM);

module.exports = router;
