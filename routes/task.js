const express = require("express");
const { postTaskToCRM, updateTaskToCRM } = require("../controller/task");

const router = express.Router();

router.post('/kylas-Tasks', postTaskToCRM);

router.post('/kylas-Tasks-update', updateTaskToCRM);

module.exports = router;
