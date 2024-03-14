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
                    "Account_Name": {
                        "name": deal.entity.associatedContacts != null ? deal.entity.associatedContacts[0].name : ""
                    },
                    "Kyla_s_Deal_id": deal.entity.id || ""
                },
            ],
        };

        const response = await PostDeal(Dealdata);
        console.log('Deal posted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.error('Error posting Deal to Zoho CRM:', error.response ? error.response.data : error);
    }
}

// Update Contact 
const updateContact = async (contactData, contactId) => {
    const config = {
        method: 'put',
        url: `https://www.zohoapis.in/crm/v2/Contacts/${contactId}`,
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(contactData)
    };

    try {
        return await axios(config);
    } catch (error) {
        console.error('Error in updateContact function:', error);
        throw error;
    }
}

// Update Deal
const getDealIdByPhoneNumber = async (phoneNumber) => {
    const apiUrl = `https://www.zohoapis.in/crm/v2/Contacts/search?phone=${phoneNumber})`;

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
        return response.data.data[0].id;
    } catch (error) {
        console.log('Error in getContactIdByPhoneNumber function:', error);
        console.log('Contact Phone Not found:', phoneNumber);
        throw error;
    }
};


exports.updateDealToZohoCRM = async (deal) => {
    const contactId = await getContactIdByPhoneNumber(phoneData);
    console.log("contactId");
    console.log(contactId);


    try {
        const contactData = {
            data: [
                {
                    First_Name: contact.entity.firstName || "",
                    Last_Name: contact.entity.lastName || "",
                    Phone: (contact.entity.phoneNumbers[0].dialCode + contact.entity.phoneNumbers[0].value) || "",
                    Email: (contact.entity.emails == null) ? "" : (contact.entity.emails[0].value),
                    City: contact.entity.city || "",
                    State: contact.entity.state || "",
                    Zip_Code: contact.entity.zipcode || "",
                    Kylas_Contact_Owner: contact.entity.ownerId.value || "",
                    Lead_Source: contact.entity.source.name || "",
                    Main_Crop: (contact.entity.customFieldValues && contact.entity.customFieldValues.cfMainCrops) ? contact.entity.customFieldValues.cfMainCrops || "" : "",
                    Identification: (contact.entity.customFieldValues && contact.entity.customFieldValues.cfIdentification) ? contact.entity.customFieldValues.cfIdentification.value || "" : "",
                    Acres_of_Land_If_Farmer: (contact.entity.customFieldValues && contact.entity.customFieldValues.cfAcresOfLandIfFarmer) ? contact.entity.customFieldValues.cfAcresOfLandIfFarmer || "" : "",
                },
            ],
        };

        const response = await updateContact(contactData, contactId);
        console.log('Contact updated to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.error('Error updating Contact to Zoho CRM:', error.response ? error.response.data : error);
    }
}