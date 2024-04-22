const axios = require('axios');

const marketPlaces = {
    "Shopify13": "GGV Canada",
    "Woocommerce": "Website Sales",
    "Shopify": "New Website (KSK)",
    "Katyayani": "Other's Sales",
    "Amazon.in": "Amazon India",
    "Offline": "Other's Sales",
    "Shopify2": "Bighaat"
}

const salesSector = {
    "Shopify13": "Ecommerce",
    "Woocommerce": "Web", //Web
    "Shopify": "Web", //Web
    "Katyayani": "Others", //Others
    "Amazon.in": "Ecommerce",//Ecommerce
    "Offline": "Others", //Others
    "Shopify2": "Ecommerce" //Ecommerce
}

const termsOfPayment = {
    "COD": "Cash on Delivery",
    "PrePaid": "Prepaid",
}

const generateAuthToken = async () => {
    try {
        const response = await axios.get(
            "https://script.google.com/macros/s/AKfycbz4HwSNCuMV-s1Bz9-G-37E1tHp7bxQ35ICns48cXgwd6mdgE4KqIT8LDuxjMr7w7Gzww/exec",
        );
        return response.data.trim();
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

const getInvoiceData = async (referenceCode) => {
    const ZOHO_BOOK_ACCESS_TOKEN = await generateAuthToken();
    console.log("ZohoBookToken", ZOHO_BOOK_ACCESS_TOKEN);
    try {
        const response = await axios.get(
            `https://www.zohoapis.in/books/v3/contacts/?organization_id=60019077540&&reference_number=${referenceCode}`,
            {
                headers: {
                    Authorization: `Zoho-oauthtoken ${ZOHO_BOOK_ACCESS_TOKEN}`,
                },
            }
        );

        const invoiceData = response.data.invoices[0];
        return invoiceData;
    } catch (e) {
        console.error("Error:", e);
        return null;
    }
};


const postCreditNoteToBooks = async (easycomData) => {
    const ZOHO_BOOK_ACCESS_TOKEN = await generateAuthToken();
    console.log("ZohoBookToken", ZOHO_BOOK_ACCESS_TOKEN);

    const config = {
        method: 'post',
        url: 'https://www.zohoapis.in/books/v3/creditnotes?organization_id=60019077540',
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_BOOK_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: easycomData
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log('Error in postInvoiceToBooks function:', error);
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

exports.postCreditnoteToZohoBooks = async (creditnote) => {
    console.log("easyecom creditnote : ", creditnote);
    const customerId = await getCustomerId(creditnote[0][0].forward_shipment_customer_contact_num);
    const invoiceData = await getInvoiceData(creditnote[0][0].reference_code);
    console.log(creditnote[0][0].order_items);
    try {
        const easycomData = {
            "customer_id": customerId,
            "invoice_number": invoiceData.invoice_number,
            "reference_number": invoiceData.reference_number,
            "line_items": [],
            "custom_fields": invoiceData.custom_fields,
        };

        for (const item of invoiceData.order_items) {
            const itemId = await getItemIdFromSKU(item.sku);
            easycomData.line_items.push({
                item_id: itemId, quantity: item.item_quantity, rate: (item.selling_price / item.item_quantity), tags: [
                    {
                        "tag_option_id": "1155413000009542011",
                        "is_tag_mandatory": false,
                        "tag_name": "Sales Sector",
                        "tag_id": "1155413000000000638",
                        "tag_option_name": salesSector[creditnote[0][0].marketplace] || creditnote[0][0].marketPlaces,
                    },
                    {
                        "tag_option_id": "1155413000012339214",
                        "is_tag_mandatory": false,
                        "tag_name": "Platform",
                        "tag_id": "1155413000000000640",
                        "tag_option_name": marketPlaces[creditnote[0][0].marketplace] || creditnote[0][0].marketPlaces,
                    }
                ],
            });
        }

        console.log(easycomData);

        const response = await postCreditNoteToBooks(easycomData);
        console.log('easyecom invoice posted to Zoho books successfully:', response.data);
    } catch (error) {
        console.log('Error posting easyecom invoice to Zoho books:', error.response ? error.response.data : error);
    }
}