const axios = require('axios');

async function fetchAccessToken() {
    const accessTokenUrl = process.env.ACCESS_TOKEN_URL;

    try {
        const response = await axios.get(accessTokenUrl);
        return response.data.trim();
    } catch (error) {
        console.error("Error fetching access token:", error);
        throw error;
    }
}

async function updateAccessToken() {
    ZOHO_CRM_ACCESS_TOKEN = '';
    try {
        const accessToken = await fetchAccessToken();
        ZOHO_CRM_ACCESS_TOKEN = accessToken;
        console.log("Zoho CRM access token updated:", ZOHO_CRM_ACCESS_TOKEN);
    } catch (error) {
        console.error("Error updating access token:", error);
    }
}

module.exports = {
    fetchAccessToken,
    updateAccessToken
}
