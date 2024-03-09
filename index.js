const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

let ZOHO_CRM_ACCESS_TOKEN = '1000.0fad0bece2b4528bdb2b520493a08a74.4802d929d1b366c9532867a3abb521fb'; // This will be updated dynamically

// Function to post a new lead to Zoho CRM API, correctly handling JSON data
async function postLead(leadData) {
    const config = {
        method: 'post',
        url: 'https://www.zohoapis.in/crm/v2/Leads',
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json' // Ensure correct content type for JSON
        },
        data: JSON.stringify(leadData) // Convert lead data to JSON string
    };

    try {
        return await axios(config);
    } catch (error) {
        console.error('Error in postLead function:', error);
        throw error; // Rethrowing the error for handling in the calling function
    }
}

async function postLeadToZohoCRM(lead) {
    console.log("lead data");
    console.log(lead);
    try {
        const leadData = {
            data: [
                {
                    First_Name: lead.entity.firstName,
                    Last_Name: lead.entity.lastName,
                    phoneNumber: lead.entity.phoneNumbers[0].number || "",
                },
            ],
        };

        const response = await postLead(leadData);
        console.log('Lead posted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.error('Error posting lead to Zoho CRM:', error.response ? error.response.data : error);
    }
}

// Endpoint to receive webhook requests from Kylas
app.post('/kylas-webhook', async (req, res) => {
    try {
        const newLead = req.body; // Assuming req.body is directly the lead object
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
