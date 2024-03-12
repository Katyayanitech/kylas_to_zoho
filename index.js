const express = require('express');
const contact = require("./routes/contact.js");
const { updateAccessToken, fetchAccessToken } = require("./utils/helpers.js")
const lead = require("./routes/lead.js")
const { setIntervalAsync } = require('set-interval-async/dynamic');

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/lead", lead);
app.use("/contact", contact);


let ZOHO_CRM_ACCESS_TOKEN = '';

updateAccessToken();

const accessTokenUpdateInterval = 60 * 60 * 1000;
setIntervalAsync(updateAccessToken, accessTokenUpdateInterval);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});