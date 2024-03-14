const express = require("express");
const { postDealToCRM, updateDealToCRM } = require("../controller/deal");

const router = express.Router();

router.post('/kylas-Deals', postDealToCRM);

router.post('/kylas-Deals-update', updateDealToCRM);

module.exports = router;
