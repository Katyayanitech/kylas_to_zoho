
const axios = require("axios");

async function fetchAllLeadData() {
    try {
        const token =
            "1000.140d1fc782c566ff796de6a9832a033b.73bad5029f90d6812c1d8c6ff6658c77";
        const url = "https://www.zohoapis.in/crm/v2/Leads/search?criteria=(Lead_Source:equals:Chat)";
        const headers = {
            Authorization: `Zoho-oauthtoken ${token}`,
        };

        const response = await axios.get(url, { headers });

        const leads = response.data.data.filter((lead) => {
            const createdTime = new Date(lead.Created_Time).getTime();
            const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
            return createdTime >= thirtyMinutesAgo;
        });

        console.log("Lead data created in the last 30 minutes:", leads);
        return leads;
    } catch (error) {
        console.error("Error fetching lead data:", error.message);
        return [];
    }
}

function mapLeadToKylasFormat(lead) {
    return {
        "lastName": `${lead.First_Name}` ?? "",
        "city": `${lead.Last_Name}` ?? "",
        "phoneNumbers": [
            {
                "type": "MOBILE",
                "code": "IN",
                "value": `${lead.Phone}` ?? "",
                "primary": true
            }
        ],
        "city": `${lead.City}` ?? "",
        "state": `${lead.State}` ?? "",
        "country": `${lead.Country}` ?? "",
        "source": 81564,
        "subSource": "Sales IQ"
        // "companyName": `${lead.SENDER_COMPANY}`,
        // "requirementName": `${lead.SUBJECT}`,
    };
}

async function postLeadToKylas(lead) {
    try {
        const postData = mapLeadToKylasFormat(lead);
        const url = 'https://api.kylas.io/v1/leads';
        const headers = {
            'api-key': '1e8d51e4-de78-4394-b5a9-e9d10b1e72d2'
        };

        const response = await axios.post(url,
            postData
            , { headers });

        console.log('Lead posted to Kylas:', response.data);
    } catch (error) {
        console.error('Error posting lead to Kylas:', error.message);
    }
}

async function processLeadData() {
    const leadsData = await fetchAllLeadData();

    for (const lead of leadsData) {
        await postLeadToKylas(lead);
    }
}




function ZohoCRMToKylasChatLeads() {
    processLeadData();
    setInterval(processLeadData, 30 * 60 * 1000);
}

module.exports = {
    ZohoCRMToKylasChatLeads
}