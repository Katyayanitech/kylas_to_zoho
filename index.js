const express = require('express');
const axios = require('axios');
const qs = require('qs');

const app = express();
app.use(express.json());

// Zoho CRM API credentials
let ZOHO_CRM_ACCESS_TOKEN = ''; // This will be updated dynamically
const ZOHO_CRM_REFRESH_TOKEN = '1000.73c649ffc57208adbb3d98c93d5fb695.2743446b34d737820919b76f80736cde';
const CLIENT_ID = '1000.M5D17N2P0XNFGB8T3B2WL8UCXDBOBV';
const CLIENT_SECRET = '4c2bc771c7540978217ae92902c4d504de64bc3f96';
const REDIRECT_URI = 'http://google.com/oauth2callback';

// Function to refresh the Zoho CRM access token
async function refreshAccessToken() {
    const params = new URLSearchParams();
    params.append('refresh_token', ZOHO_CRM_REFRESH_TOKEN);
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('grant_type', 'refresh_token');

    try {
        const response = await axios.post('https://accounts.zoho.in/oauth/v2/token', params);
        ZOHO_CRM_ACCESS_TOKEN = response.data.access_token;
        console.log('Access token refreshed successfully');
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw new Error('Failed to refresh access token');
    }
}

// Function to post a new lead to Zoho CRM API
async function postLead(data) {
    const config = {
        method: 'post',
        url: 'https://www.zohoapis.in/crm/v2/Leads',
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    return await axios(config);
}

async function postLeadToZohoCRM(lead) {
    try {
        await refreshAccessToken(); // Ensure we have a fresh access token before attempting to post
        console.log(ZOHO_CRM_ACCESS_TOKEN);
        const data = qs.stringify({
            'data': JSON.stringify([
                {
                    'Company': lead.company,
                    'Last_Name': lead.lastName,
                    'First_Name': lead.firstName,
                    'Email': lead.email,
                    // Add more fields as needed
                }
            ])
        });

        const response = await postLead(data);
        console.log('Lead posted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.error('Error posting lead to Zoho CRM:', error);
        if (error.response && error.response.status === 401) { // 401 indicates an Unauthorized response, suggesting an expired or invalid token
            console.error('Access token might be expired or invalid. Please refresh and try again.');
        }
    }
}

// Endpoint to receive webhook requests from Kylas
app.post('/kylas-webhook', async (req, res) => {
    try {
        const newLead = req.body;
        await postLeadToZohoCRM(newLead);
        console.log("somplete");
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
