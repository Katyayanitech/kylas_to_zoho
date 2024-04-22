const express = require('express');
const { updateAccessToken } = require("./utils/helpers.js")
const { setIntervalAsync } = require('set-interval-async/dynamic');
const lead = require("./routes/lead.js");
const contact = require("./routes/contact.js");
const deal = require("./routes/deal.js");
const task = require("./routes/task.js");
const call = require("./routes/call.js");
const creditnote = require("./routes/creditnote.js");
const invoice = require("./routes/invoice.js");
const easyecominvoice = require("./routes/easyecom.js");
const easyecomcreditnote = require("./routes/easyecomcreditnote.js");
const { indiamartToKylas } = require("./utils/indiamart.js");
const { ZohoCRMToKylasChatLeads } = require("./utils/ZohoCrmToKylasChatLeads.js");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/lead", lead);
app.use("/contact", contact);
app.use("/deal", deal);
app.use("/task", task);
app.use("/call", call);

app.use("/creditnote", creditnote);
app.use("/invoice", invoice);
app.use("/easyecom", easyecominvoice);
app.use("/easyecomcreditnote", easyecomcreditnote);


let ZOHO_CRM_ACCESS_TOKEN = '';

updateAccessToken();
indiamartToKylas();
ZohoCRMToKylasChatLeads();

setIntervalAsync(updateAccessToken, 45 * 60 * 1000);
setIntervalAsync(indiamartToKylas, 10 * 60 * 1000);
setIntervalAsync(ZohoCRMToKylasChatLeads, 30 * 60 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 