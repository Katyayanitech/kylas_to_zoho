const axios = require('axios');

const searchProductBySKU = async (sku) => {
    const config = {
        method: 'get',
        url: `https://www.zohoapis.in/crm/v2/Products/search?criteria=(Product_Code:equals:${encodeURIComponent(sku)})`,
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios(config);
        return response.data.data[0];
    } catch (error) {
        console.log('Error searching product by SKU:', error);
        throw error;
    }
};

const searchContactByPhone = async (phoneNumber) => {
    const config = {
        method: 'get',
        url: `https://www.zohoapis.in/crm/v2/Contacts/search?phone=${phoneNumber}`,
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios(config);
        return response.data.data[0]; // Assuming only one contact will be returned
    } catch (error) {
        console.log('Error searching contact by phone number:', error);
        throw error;
    }
};

const postInvoice = async (invoiceData) => {
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
        console.log('Error posting invoice to Zoho CRM:', error);
        throw error;
    }
};

exports.PostBookToCRM = async (invoice) => {
    console.log("invoice");
    console.log(invoice);
    console.log("Line Items");
    console.log(invoice.invoice.line_items);

    try {
        const productDetails = [];

        for (let i = 0; i < invoice.invoice.line_items.length; i++) {
            const lineItem = invoice.invoice.line_items[i];
            const product = await searchProductBySKU(lineItem.sku);

            const productDetail = {
                "product": {
                    "id": product.id
                },
                "quantity": lineItem.quantity,
                "Discount": lineItem.discount,
                "total_after_discount": lineItem.total - lineItem.discount,
                "net_total": lineItem.total,
                "Tax": lineItem.tax_total,
                "list_price": lineItem.rate,
                "unit_price": lineItem.rate,
                "quantity_in_stock": lineItem.quantity,
                "total": lineItem.total,
                "product_description": lineItem.description || null,
                "line_tax": []
            };

            productDetails.push(productDetail);
        }

        const contact = await searchContactByPhone(invoice.invoice.billing_address.phone);

        const invoiceData = {
            data: [
                {
                    "Payment_Type": invoice.invoice.custom_field_hash.cf_terms_of_payment == "Cash on Delivery" ? "COD" : invoice.invoice.custom_field_hash.cf_terms_of_payment,
                    "Currency": invoice.invoice.currency_code,
                    "Invoice_Date": invoice.invoice.date,
                    "Grand_Total": invoice.invoice.total,
                    "Sales_person": invoice.invoice.salesperson_name,
                    "Contact_Name": {
                        "id": contact.id,
                    },
                    "Status": invoice.invoice.status,
                    "Shipping_State": invoice.invoice.shipping_address.state,
                    "Subject": invoice.invoice.invoice_number,
                    "Product_Details": productDetails,
                },
            ],
        };

        console.log("invoiceData");
        console.log(invoiceData);

        const response = await postInvoice(invoiceData);
        console.log('Invoice posted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.log('Error posting invoice to Zoho CRM:', error.response ? error.response.data : error);
    }
};
