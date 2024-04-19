const axios = require('axios');

const marketPlaces = {
    "Shopify13": "GGV Canada",
    "Woocommerce": "Website Sales",
    "Shopify": "New Website (KSK)",
    "Katyayani": "Other's Sales",
    "Amazon.in": "Amazon India",
    "Offline": "Other's Sales",
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



exports.postInvoiceToZohoBooks = async (invoice) => {
    console.log("easyecom invoice : ", invoice);
    const customerId = await getCustomerId(invoice[0].contact_num);
    console.log(invoice[0].order_items);
    try {
        const easycomData = {
            "customer_id": customerId,
            "invoice_number": invoice[0].reference_code,
            "line_items": [],
            "custom_fields": [
                {
                    "field_id": "1155413000002568031",
                    "customfield_id": "1155413000002568031",
                    "show_in_store": false,
                    "show_in_portal": false,
                    "is_active": true,
                    "index": 1,
                    "label": "Marketplace",
                    "show_on_pdf": true,
                    "edit_on_portal": false,
                    "edit_on_store": false,
                    "api_name": "cf_sales_account",
                    "show_in_all_pdf": true,
                    "selected_option_id": "1155413000002568033",
                    "value_formatted": marketPlaces[invoice[0].marketplace],
                    "search_entity": "invoice",
                    "data_type": "dropdown",
                    "placeholder": "cf_sales_account",
                    "value": marketPlaces[invoice[0].marketplace],
                    "is_dependent_field": false
                },
                {
                    "field_id": "1155413000001759107",
                    "customfield_id": "1155413000001759107",
                    "show_in_store": false,
                    "show_in_portal": false,
                    "is_active": true,
                    "index": 1,
                    "label": "Terms of Payment",
                    "show_on_pdf": true,
                    "edit_on_portal": false,
                    "edit_on_store": false,
                    "api_name": "cf_terms_of_payment",
                    "show_in_all_pdf": true,
                    "value_formatted": termsOfPayment[invoice[0].payment_mode],
                    "search_entity": "invoice",
                    "data_type": "multiselect",
                    "placeholder": "cf_terms_of_payment",
                    "value": [
                        termsOfPayment[invoice[0].payment_mode]
                    ],
                    "is_dependent_field": false
                },
            ]
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