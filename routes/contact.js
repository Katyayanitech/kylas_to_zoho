const express = require("express");
const axios = require("axios");

const router = express.Router();

async function Postcontact(Contactdata) {
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
async function Postcontactzoho(contact) {
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

router.post('/kylas-Contacts', async (req, res) => {
    try {
        const newcontact = req.body;
        await Postcontactzoho(newcontact);
        return res.status(200).send('Contact processed successfully');
    } catch (error) {
        console.error('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
});

module.exports = router;

