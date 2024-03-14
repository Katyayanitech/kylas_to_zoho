const express = require("express");
const { postDealToCRM } = require("../controller/deal");

const router = express.Router();

router.post('/kylas-Deals', postDealToCRM);

module.exports = router;
