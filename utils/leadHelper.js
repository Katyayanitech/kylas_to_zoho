const axios = require('axios');

const postLead = async (leadData) => {
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

exports.postLeadToZohoCRM = async (lead) => {
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
                    Kylas_Owner: lead.entity.ownerId.value || "",
                },
            ],
        };

        const response = await postLead(leadData);
        console.log('Lead posted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.error('Error posting lead to Zoho CRM:', error.response ? error.response.data : error);
    }
}

// Update Leads
const updateLead = async (leadData) => {
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

exports.updateLeadToZohoCRM = async (lead) => {
    console.log("update lead data");
    console.log(lead);
    console.log("phone numbers");
    console.log(lead.entity.phoneNumbers);
    console.log("phone numbers [0]");
    console.log(lead.entity.phoneNumbers[0]);
    // try {
    //     const leadData = {
    //         data: [
    //             {
    //                 First_Name: lead.entity.firstName,
    //                 Last_Name: lead.entity.lastName,
    //                 Phone: (lead.entity.phoneNumbers[0].dialCode + lead.entity.phoneNumbers[0].value) || "",
    //                 Email: (lead.entity.emails == null) ? "" : (lead.entity.emails[0].value),
    //                 City: lead.entity.city || "",
    //                 State: lead.entity.state || "",
    //                 Zip_Code: lead.entity.zipcode || "",
    //                 Lead_Source: lead.entity.source.value || "",
    //                 Kylas_Owner: lead.entity.ownerId.value || "",
    //             },
    //         ],
    //     };

    //     const response = await updateLead(leadData);
    //     console.log('Lead posted to Zoho CRM successfully:', response.data);
    // } catch (error) {
    //     console.error('Error posting lead to Zoho CRM:', error.response ? error.response.data : error);
    // }
}

