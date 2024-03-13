const express = require("express");
const { postTaskToCRM } = require("../controller/task");

const router = express.Router();

router.post('/kylas-Tasks', postTaskToCRM);

module.exports = router;
