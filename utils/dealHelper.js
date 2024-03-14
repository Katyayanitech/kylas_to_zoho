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

    try {
        const Dealdata = {
            data: [
                {
                    "Deal_Name": deal.entity.name || "",
                    "Amount": deal.entity.estimatedValue.value || "",
                    "Stage": (deal.entity.pipeline != null) ? (deal.entity.pipeline.stage.name || "") : "",
                    "Closing_Date": formattedClosureDate || "",
                    "Kylas_Deal_Owner": deal.entity.ownedBy.name || "",
                    "Contact_Name": deal.entity.associatedContacts != null ? deal.entity.associatedContacts[0].name : ""
                },
            ],
        };

        const response = await PostDeal(Dealdata);
        console.log('Deal posted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.error('Error posting Deal to Zoho CRM:', error.response ? error.response.data : error);
    }
}