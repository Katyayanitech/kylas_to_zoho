const express = require('express');
const { updateAccessToken } = require("./utils/helpers.js")
const { setIntervalAsync } = require('set-interval-async/dynamic');
const lead = require("./routes/lead.js");
const contact = require("./routes/contact.js");
const deal = require("./routes/deal.js");
const task = require("./routes/task.js");
const call = require("./routes/call.js");
const invoice = require("./routes/invoice.js");
const axios = require('axios');

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/lead", lead);
app.use("/contact", contact);
app.use("/deal", deal);
app.use("/task", task);
app.use("/call", call);

app.use("/invoice", invoice);


let ZOHO_CRM_ACCESS_TOKEN = '';

updateAccessToken();

const accessTokenUpdateInterval = 10 * 60 * 1000;
setIntervalAsync(updateAccessToken, accessTokenUpdateInterval);


let lastLeadQueryTime = null;
let leadsArray = [];

function formatDate(date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${day}-${month}-${year}${hours}:${minutes}:${seconds}`;
}

function mapLeadToKylasFormat(lead) {
    return {
        "lastName": `${lead.SENDER_NAME}`,
        "city": `${lead.SENDER_CITY}`,
        "phoneNumbers": [
            {
                "type": "MOBILE",
                "code": `${lead.SENDER_COUNTRY_ISO}`,
                "value": lead.SENDER_MOBILE,
                "primary": true
            }
        ],
        "state": `${lead.SENDER_STATE}`,
        "country": `${lead.SENDER_COUNTRY_ISO}`,
        "source": 80347,
        "companyName": `${lead.SENDER_COMPANY}`,
        "requirementName": `${lead.SUBJECT}`,
        "subSource": "Katyayani"
    };
}

async function postLeadToKylas(lead) {
    try {
        const postData = mapLeadToKylasFormat(lead);

        const response = await axios.post('https://api.kylas.io/v1/leads', postData, {
            headers: {
                'api-key': '1e8d51e4-de78-4394-b5a9-e9d10b1e72d2'
            }
        });

        console.log('IndiaMart Lead posted to Kylas:', response.data);
    } catch (error) {
        console.error('Error posting lead to Kylas:', error);
    }
}

async function fetchLeads() {
    try {
        const currentTime = new Date();
        console.log("currentTime");
        console.log(currentTime);

        const endTime = formatDate(currentTime);

        const startTime = lastLeadQueryTime ?? formatDate(new Date(Date.now() - 5 * 60 * 1000));

        const apiUrl = `https://mapi.indiamart.com/wservce/crm/crmListing/v2/?glusr_crm_key=mRyyE71u4H/AS/eq4XCO7l2Ko1rNlDRk&start_time=${startTime}&end_time=${endTime}`;
        console.log(apiUrl);

        const response = await axios.get(apiUrl);

        if (response.status === 200 && response.data.STATUS === 'SUCCESS') {
            const leads = response.data.RESPONSE;
            console.log("leads");
            console.log(leads);
            if (leads.length > 0) {
                lastLeadQueryTime = leads[leads.length - 1].QUERY_TIME;
            }

            leadsArray = leads;

            console.log('Received leads:', leadsArray);

            for (const lead of leadsArray) {
                await postLeadToKylas(lead);
            }
        } else {
            console.error('Error: Unable to fetch leads. Status:', response.data.STATUS);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

function scheduleAPIPolling() {
    fetchLeads();

    setInterval(fetchLeads, 5 * 60 * 1000);
}

lastLeadQueryTime = formatDate(new Date(Date.now() - 5 * 60 * 1000));

scheduleAPIPolling();


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});