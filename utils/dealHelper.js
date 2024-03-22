const axios = require('axios');

const PostDeal = async (Dealdata) => {
    const config = {
        method: 'post',
        url: 'https://www.zohoapis.in/crm/v2/Deals',
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(Dealdata)
    };

    try {
        return await axios(config);
    } catch (error) {
        console.error('Error in postDeal function:', error);
        throw error;
    }
}

exports.PostDealzoho = async (deal) => {
    console.log("Deal Data ");
    console.log(deal);
    console.log("Pipeline Stage");
    let formattedClosureDate = "";

    if (deal.entity.estimatedClosureOn != null) {
        const closureDate = new Date(deal.entity.estimatedClosureOn);
        formattedClosureDate = `${closureDate.getFullYear()}-${(closureDate.getMonth() + 1).toString().padStart(2, '0')}-${closureDate.getDate().toString().padStart(2, '0')}`;
    } else {
        formattedClosureDate = "";
    }
    console.log("Contact");
    console.log(deal.entity.associatedContacts[0]);
    console.log("deal Id");
    console.log(deal.entity.id);

    try {
        const Dealdata = {
            data: [
                {
                    "Deal_Name": deal.entity.name || "",
                    "Amount": deal.entity.estimatedValue.value || "",
                    "Stage": (deal.entity.pipeline != null) ? (deal.entity.pipeline.stage.name || "") : "",
                    "Closing_Date": formattedClosureDate || "",
                    "Kylas_Deal_Owner": deal.entity.ownedBy.name || "",
                    "Kyla_s_Deal_id": deal.entity.id.toString() || "",
                    "Account_Name": {
                        "name": (deal.entity.associatedContacts && deal.entity.associatedContacts.length > 0) ? deal.entity.associatedContacts[0].name : ""
                    },
                },
            ],
        };
        console.log("Dealdata");
        console.log(Dealdata);

        const response = await PostDeal(Dealdata);
        console.log('Deal posted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.error('Error posting Deal to Zoho CRM:', error.response ? error.response.data : error);
    }
}

// Update Deal
const updateDeal = async (dealData, dealId) => {
    const config = {
        method: 'put',
        url: `https://www.zohoapis.in/crm/v2/Deals/${dealId}`,
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(dealData)
    };

    try {
        return await axios(config);
    } catch (error) {
        console.error('Error in updateDeal function:', error);
        throw error;
    }
}

// Update Deal
const getDealIdByKylasDealId = async (kylasDealId) => {
    const apiUrl = `https://www.zohoapis.in/crm/v2/Deals/search?criteria=(Kyla_s_Deal_id:equals:${kylasDealId})`;

    const config = {
        method: 'get',
        url: apiUrl,
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios(config);
        if (response.data && response.data.data && response.data.data.length > 0) {
            return response.data.data[0].id;
        } else {
            console.log('No deal found with Kyla_s_Deal_id:', kylasDealId);
            return null;
        }
    } catch (error) {
        console.log('Error in getDealIdByKylasDealId function:', error);
        return null;
    }
};


exports.updateDealToZohoCRM = async (deal) => {
    console.log("deal");
    console.log(deal);
    const kylasDealId = deal.entity.id;
    const dealId = await getDealIdByKylasDealId(kylasDealId);
    console.log("dealId");
    console.log(dealId);
    let formattedClosureDate = "";

    if (deal.entity.estimatedClosureOn != null) {
        const closureDate = new Date(deal.entity.estimatedClosureOn);
        formattedClosureDate = `${closureDate.getFullYear()}-${(closureDate.getMonth() + 1).toString().padStart(2, '0')}-${closureDate.getDate().toString().padStart(2, '0')}`;
    } else {
        formattedClosureDate = "";
    }

    try {
        const dealData = {
            data: [
                {
                    "Deal_Name": deal.entity.name || "",
                    "Amount": deal.entity.estimatedValue.value || "",
                    "Stage": (deal.entity.pipeline != null) ? (deal.entity.pipeline.stage.name || "") : "",
                    "Closing_Date": formattedClosureDate || "",
                    "Kylas_Deal_Owner": deal.entity.ownedBy.name || "",
                    "Kyla_s_Deal_id": deal.entity.id.toString() || "",
                    "Account_Name": {
                        "name": (deal.entity.associatedContacts && deal.entity.associatedContacts.length > 0) ? deal.entity.associatedContacts[0].name : ""
                    },
                },
            ],
        };

        if (dealId !== undefined) {
            const response = await updateDeal(dealData, dealId);
            console.log('Deal updated to Zoho CRM successfully:', response.data);
        } else {
            console.log('No deal ID found for Kylas_Deal_id:', kylasDealId);
        }
    } catch (error) {
        console.error('Error updating Deal to Zoho CRM:', error.response ? error.response.data : error);
    }
}