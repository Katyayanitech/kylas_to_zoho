const axios = require("axios");

async function generateAuthToken() {
    try {
        const response = await axios.post(
            "https://accounts.zoho.in/oauth/v2/token?refresh_token=1000.73c649ffc57208adbb3d98c93d5fb695.2743446b34d737820919b76f80736cde&client_id=1000.M5D17N2P0XNFGB8T3B2WL8UCXDBOBV&client_secret=4c2bc771c7540978217ae92902c4d504de64bc3f96&redirect_uri=http://google.com/oauth2callback&grant_type=refresh_token",
        );

        return response.data.access_token;
    } catch (error) {
        console.error("Error generating auth token:", error.message);
        throw error;
    }
}

async function fetchInvoicesData(authToken) {
    const organizationId = "60019077540";

    try {
        const currentTime = new Date();
        const oneHourAgo = new Date(currentTime - 60 * 60 * 1000);
        const formattedOneHourAgo = oneHourAgo.toISOString();

        const response = await axios.get(
            `https://www.zohoapis.in/books/v3/invoices?organization_id=${organizationId}`,
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${authToken}`,
                },
            },
        );

        const invoicesData = response.data.invoices.filter((invoice) => {
            return new Date(invoice.created_time) > oneHourAgo;
        });

        return invoicesData;
    } catch (error) {
        console.error("Error fetching invoices data:", error.message);
        throw error;
    }
}

function printInvoicesData(invoicesData) {
    console.log("Invoices data:", invoicesData);
}

async function executeHourlyTask() {
    try {
        const authToken = await generateAuthToken();
        const invoicesData = await fetchInvoicesData(authToken);
        printInvoicesData(invoicesData);
    } catch (error) {
        console.error("Error executing hourly task:", error.message);
    }
}

executeHourlyTask();
setInterval(executeHourlyTask, 3600000);