const express = require("express");
const axios = require("axios");
const { postContactToCRM } = require("../controller/contact.js");

const router = express.Router();

router.post('/kylas-Contacts', postContactToCRM);



module.exports = router;