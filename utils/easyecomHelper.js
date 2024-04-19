const axios = require('axios');

const generateAuthToken = async () => {
    try {
        const response = await axios.post(
            "https://accounts.zoho.in/oauth/v2/token?refresh_token=1000.73c649ffc57208adbb3d98c93d5fb695.2743446b34d737820919b76f80736cde&client_id=1000.M5D17N2P0XNFGB8T3B2WL8UCXDBOBV&client_secret=4c2bc771c7540978217ae92902c4d504de64bc3f96&redirect_uri=http://google.com/oauth2callback&grant_type=refresh_token",
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Error generating auth token:", error.message);
        // throw error;
    }
};

const getCustomerId = async (phoneNumber) => {
    const ZOHO_BOOK_ACCESS_TOKEN = await generateAuthToken();
    console.log("ZohoBookToken", ZOHO_BOOK_ACCESS_TOKEN);
    try {
        const response = await axios.get(
            `https://www.zohoapis.in/books/v3/contacts/?organization_id=60019077540&phone=91${phoneNumber}`,
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${ZOHO_BOOK_ACCESS_TOKEN}`,
                },
            }
        );

        const contactId = response.data.contacts[0].contact_id;
        return contactId;
    } catch (e) {
        console.error("Error:", e);
        return null;
    }
};


const postInvoiceToBooks = async (easycomData) => {
    const ZOHO_BOOK_ACCESS_TOKEN = await generateAuthToken();
    console.log("ZohoBookToken", ZOHO_BOOK_ACCESS_TOKEN);
    const config = {
        method: 'post',
        url: 'https://www.zohoapis.in/books/v3/invoices?organization_id=60019077540',
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_BOOK_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(easycomData)
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log('Error in postLead function:', error);
        // throw error;
    }
}

const getItemIdFromSKU = async (sku) => {
    try {
        const ZOHO_BOOK_ACCESS_TOKEN = await generateAuthToken();
        const response = await axios.get(
            `https://www.zohoapis.in/books/v3/items?organization_id=60019077540&sku=${sku}`,
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${ZOHO_BOOK_ACCESS_TOKEN}`,
                },
            }
        );

        const itemId = response.data.items[0].item_id;
        return itemId;
    } catch (error) {
        console.error("Error getting item ID:", error);
        return null;
    }
};



exports.postInvoiceToZohoBooks = async (invoice) => {
    console.log("easyecom invoice : ", invoice);
    const customerId = await getCustomerId(invoice[0].contact_num);
    console.log(invoice[0].order_items);
    try {
        const easycomData = {
            "customer_id": customerId,
            "line_items": [],
        };

        for (const item of invoice[0].order_items) {
            const itemId = await getItemIdFromSKU(item.sku);
            easycomData.line_items.push({ item_id: itemId, quantity: item.item_quantity, rate: (item.selling_price / item.item_quantity) });
        }

        console.log(easycomData);

        const response = await postInvoiceToBooks(easycomData);
        console.log('easyecom invoice posted to Zoho books successfully:', response.data);
    } catch (error) {
        console.log('Error posting easyecom invoice to Zoho books:', error.response ? error.response.data : error);
    }
}