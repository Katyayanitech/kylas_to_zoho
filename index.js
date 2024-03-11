const express = require('express');
const axios = require('axios');
const { setIntervalAsync } = require('set-interval-async/dynamic');

const app = express();
app.use(express.json());

let ZOHO_CRM_ACCESS_TOKEN = '';

async function fetchAccessToken() {
    const accessTokenUrl = "https://script.googleusercontent.com/macros/echo?user_content_key=4ZS3JWehoZe9AG4UeNXy5t0frgaKWFkRDX2I42pBCSTNWS170H-goZvaHYSjVbxFsM4WEmw5GNb6O-MQ5yhIVRRwK8wQslAWm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnP-u-p9iTG4jdgmUvWl3RYGEI1cvNowZuDl8EcfID0pm0Kc1gdImgzUha5MgDMQrEwZvnmwH8tzlu022UqIZfQsauDmOpfYrHNz9Jw9Md8uu&lib=MPo20bEL0RwzBzCUXHRmQVrtrsWyMfJRS";

    try {
        const response = await axios.get(accessTokenUrl);
        return response.data.trim();
    } catch (error) {
        console.error("Error fetching access token:", error);
        throw error;
    }
}

async function updateAccessToken() {
    try {
        const accessToken = await fetchAccessToken();
        ZOHO_CRM_ACCESS_TOKEN = accessToken;
        console.log("Zoho CRM access token updated:", ZOHO_CRM_ACCESS_TOKEN);
    } catch (error) {
        console.error("Error updating access token:", error);
    }
}

updateAccessToken();

const accessTokenUpdateInterval = 60 * 60 * 1000;
setIntervalAsync(updateAccessToken, accessTokenUpdateInterval);

async function postLead(leadData) {
    const config = {
        method: 'post',
        url: 'https://www.zohoapis.in/crm/v2/Leads',
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(leadData)
    };

    try {
        return await axios(config);
    } catch (error) {
        console.error('Error in postLead function:', error);
        throw error;
    }
}

async function postLeadToZohoCRM(lead) {
    console.log("lead data");
    console.log(lead);
    console.log("lead number");
    console.log(lead.entity.phoneNumbers[0].value);
    try {
        const leadData = {
            data: [
                {
                    First_Name: lead.entity.firstName,
                    Last_Name: lead.entity.lastName,
                    Phone: (lead.entity.phoneNumbers[0].dialCode + lead.entity.phoneNumbers[0].value) || "",
                    Email: (lead.entity.emails == null) ? "" : (lead.entity.emails[0].value),
                    City: lead.entity.city || "",
                    State: lead.entity.state || "",
                    Zip_Code: lead.entity.zipcode || "",
                    Lead_Source: lead.entity.source.value || "",
                    Kylas_Owner: lead.entity.ownerId.value,
                },
            ],
        };

        const response = await postLead(leadData);
        console.log('Lead posted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.error('Error posting lead to Zoho CRM:', error.response ? error.response.data : error);
    }
}

app.post('/kylas-webhook', async (req, res) => {
    try {
        const newLead = req.body;
        await postLeadToZohoCRM(newLead);
        res.status(200).send('Lead processed successfully');
    } catch (error) {
        console.error('Error processing webhook request:', error);
        res.status(500).send('Error processing webhook request');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
