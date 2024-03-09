const express = require('express');
const axios = require('axios');
const qs = require('qs');

const app = express();
app.use(express.json());

let ZOHO_CRM_ACCESS_TOKEN = '1000.0fad0bece2b4528bdb2b520493a08a74.4802d929d1b366c9532867a3abb521fb'; // This will be updated dynamically

// Function to refresh the Zoho CRM access token
// async function refreshAccessToken() {
//     const tokenRefreshUrl = 'https://accounts.zoho.in/oauth/v2/token?grant_type=refresh_token&refresh_token=1000.73c649ffc57208adbb3d98c93d5fb695.2743446b34d737820919b76f80736cde&client_id=1000.M5D17N2P0XNFGB8T3B2WL8UCXDBOBV&client_secret=4c2bc771c7540978217ae92902c4d504de64bc3f96&redirect_uri=http://google.com/oauth2callback';
    
//     try {
//         const response = await axios.post(tokenRefreshUrl);
//         ZOHO_CRM_ACCESS_TOKEN = response.data.access_token;
//         console.log('Access token refreshed successfully:', ZOHO_CRM_ACCESS_TOKEN);
//     } catch (error) {
//         console.error('Error refreshing access token:', error);
//         throw new Error('Failed to refresh access token');
//     }
// }

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
        // await refreshAccessToken(); // Ensure we have a fresh access token before attempting to post

        const data = qs.stringify({
            'data': JSON.stringify([
                {
                    "Last_Name": "unique",
                    "First_Name": "22",
                }
            ])
        });

        const response = await postLead(data);
        console.log('Lead posted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.error('Error posting lead to Zoho CRM:', error);
    }
}

// Endpoint to receive webhook requests from Kylas
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
