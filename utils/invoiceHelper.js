const axios = require('axios');

const Postinvoice = async (invoiceData) => {
    const config = {
        method: 'post',
        url: 'https://www.zohoapis.in/crm/v2/Invoices',
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(invoiceData)
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log('Error in postContact function:', error);
        throw error;
    }
}

exports.PostBookToCRM = async (invoice) => {
    console.log("invoice");
    console.log(invoice);
    console.log("Line Items");
    console.log(invoice.invoice.line_items);

    // try {
    //     const invoiceData = {
    //         data: [
    //             {
    //                 "Owner": {
    //                     "name": "Katyayani Manager",
    //                     "id": "431127000000257001",
    //                     "email": "katyayanimanager@gmail.com"
    //                 },
    //                 "Payment_Type": invoice.invoice.custom_field_hash.cf_terms_of_payment,
    //                 "Currency": invoice.invoice.currency_code,
    //                 "Invoice_Date": invoice.invoice.date,
    //                 "Grand_Total": invoice.invoice.total,
    //                 "Contact_Name": {
    //                     "name": "Katyayani organics",
    //                     "id": "431127000007006876"
    //                 },
    //                 "Account_Name": {
    //                     "name": "Katyayani Organics",
    //                     "id": "431127000001985473"
    //                 },
    //                 "Status": invoice.invoice.status,
    //                 "Shipping_State": invoice.invoice.shipping_address.state,
    //                 "Subject": invoice.invoice.invoice_number,
    //                 "Product_Details": [
    //                     {
    //                         "product": {
    //                             "Product_Code": null,
    //                             "Currency": "INR",
    //                             "name": "Katyayani Activated Humic Acid + Fulvic Acid 98800 GM (800gm x 1)",
    //                             "id": "431127000004118252"
    //                         },
    //                         "quantity": 1,
    //                         "Discount": 0,
    //                         "total_after_discount": 1,
    //                         "net_total": 1,
    //                         "book": null,
    //                         "Tax": 0,
    //                         "list_price": 1,
    //                         "unit_price": 1,
    //                         "quantity_in_stock": -1,
    //                         "total": 1,
    //                         "id": "431127000013198002",
    //                         "product_description": null,
    //                         "line_tax": []
    //                     }
    //                 ]
    //             },
    //         ],
    //     };

    //     console.log("invoiceData");
    //     console.log(invoiceData);

    //     const response = await Postinvoice(invoiceData);
    //     console.log('Invoice posted to Zoho CRM successfully:', response.data);
    // } catch (error) {
    //     console.log('Error posting invoice to Zoho CRM:', error.response ? error.response.data : error);
    // }
}