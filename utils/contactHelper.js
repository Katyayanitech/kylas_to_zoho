const axios = require('axios');

const Postcontact = async (Contactdata) => {
    const config = {
        method: 'post',
        url: 'https://www.zohoapis.in/crm/v2/Contacts',
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(Contactdata)
    };

    try {
        return await axios(config);
    } catch (error) {
        console.error('Error in postContact function:', error);
        throw error;
    }
}

exports.Postcontactzoho = async (contact) => {
    console.log("Contact Data ");
    console.log(contact);
    console.log(contact.entity.phoneNumbers[0]);

    try {
        const Contactdata = {
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

        const response = await Postcontact(Contactdata);
        console.log('Contact posted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.error('Error posting Contact to Zoho CRM:', error.response ? error.response.data : error);
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

const getContactIdByPhoneNumber = async (phoneNumber) => {
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
        console.error('Error in getContactIdByPhoneNumber function:', error);
        throw error;
    }
};


exports.updateContactToZohoCRM = async (contact) => {
    let phoneData = contact.entity.phoneNumbers[0].value;
    console.log("phone number");
    console.log(phoneData);
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