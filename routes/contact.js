const express = require("express");
const { postContactToCRM, updateContactToCRM } = require("../controller/contact");

const router = express.Router();

router.post('/kylas-Contacts', postContactToCRM);

router.post('/kylas-Contacts-update', updateContactToCRM)

module.exports = router;