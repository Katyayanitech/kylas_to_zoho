const express = require('express');
const { updateAccessToken } = require("./utils/helpers.js")
const { setIntervalAsync } = require('set-interval-async/dynamic');
const lead = require("./routes/lead.js");
const contact = require("./routes/contact.js");
const deal = require("./routes/deal.js");
const task = require("./routes/task.js");
const call = require("./routes/call.js");
// const invoice = require("./routes/invoice.js");
const creditnote = require("./routes/creditnote.js");
const { scheduleAPIPolling } = require("./utils/indexHelpers/helper.js");
const { ZohoBookToCRMInvoice } = require("./utils/invoiceHelper.js");
const { ZohoCRMToKylasChatLeads } = require("./utils/chatLeadsHelper.js");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/lead", lead);
app.use("/contact", contact);
app.use("/deal", deal);
app.use("/task", task);
app.use("/call", call);

// Books To CRM 
// app.use("/invoice", invoice);
app.use("/creditnote", creditnote);


let ZOHO_CRM_ACCESS_TOKEN = '';

function updateAccessTokenPromise() {
    return new Promise((resolve, reject) => {
        updateAccessToken((err, token) => {
            if (err) {
                reject(err);
            } else {
                ZOHO_CRM_ACCESS_TOKEN = token;
                resolve();
            }
        });
    });
}

// Start by updating access token and then execute other functions
updateAccessTokenPromise()
    .then(() => {
        const accessTokenUpdateInterval = 10 * 60 * 1000;
        setIntervalAsync(updateAccessTokenPromise, accessTokenUpdateInterval);

        scheduleAPIPolling();
        ZohoBookToCRMInvoice();
        ZohoCRMToKylasChatLeads();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error updating access token:', err);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});