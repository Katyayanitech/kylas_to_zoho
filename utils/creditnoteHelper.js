const axios = require('axios');

const postCreditNote = async (creditnoteData, invoiceId) => {
    const config = {
        method: 'put',
        url: `https://www.zohoapis.in/crm/v2/Invoices/${invoiceId}`,
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(creditnoteData)
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log('Error posting creditnote to Zoho CRM:', error);
        throw error;
    }
};

const searchInvoiceById = async (id) => {
    const config = {
        method: 'get',
        url: `https://www.zohoapis.in/crm/v2/Invoices/search?criteria=(Book_Id:equals:${id})`,
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios(config);
        if (response.status === 200 && response.data.data.length > 0) {
            const invoiceId = response.data.data[0].id;
            return { success: true, id: invoiceId };
        } else {
            return { success: false, id: null };
        }
    } catch (error) {
        console.log('Error searching contact by phone number:', error);
        throw error;
    }
};

exports.PostBookToCRM = async (creditnote) => {
    console.log("creditnote");
    console.log(creditnote);
    console.log('invoice id');
    console.log(creditnote.creditnote.invoice_id);

    const invoiceData = await searchInvoiceById(creditnote.invoice_id);
    const invoiceId = invoiceData.id;
    const Rto_Order = invoiceData.success;
    console.log("ZohoinvoiceId");
    console.log(invoiceId);
    console.log(Rto_Order);


    try {
        const creditnoteData = {
            data: [
                {
                    "Rto_Order": Rto_Order,
                },
            ],
        };
        console.log("creditnoteData");
        console.log(creditnoteData);

        const response = await postCreditNote(creditnoteData, invoiceId);
        console.log('creditnote posted to Zoho CRM successfully:', response.data);
    }

    catch (error) {
        console.log('Error posting invoice to Zoho CRM:', error.response ? error.response.data : error);
    }
};
