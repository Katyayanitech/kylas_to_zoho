const express = require('express');
const { updateAccessToken, fetchAccessToken } = require("./utils/helpers.js")
const { setIntervalAsync } = require('set-interval-async/dynamic');
const lead = require("./routes/lead.js");
const contact = require("./routes/contact.js");
const deal = require("./routes/deal.js");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/lead", lead);
app.use("/contact", contact);
app.use("/deal", deal);


let ZOHO_CRM_ACCESS_TOKEN = '';

updateAccessToken();

const accessTokenUpdateInterval = 10 * 60 * 1000;
setIntervalAsync(updateAccessToken, accessTokenUpdateInterval);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});