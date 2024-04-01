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

const invoiceSearchById = async (id) => {
    const apiUrl = `https://www.zohoapis.in/crm/v2/Invoices/search?criteria=(Book_Id:equals:${id})`;
    console.log(apiUrl);
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
        console.log(response.data);
        const invoice = response.data.data[0];
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        const invoiceId = invoice.id;
        console.log(invoiceId);

        return { success: true, id: invoiceId };

    } catch (error) {
        console.error('Error searching invoice by ID:', error.message);
        throw error;
    }

};

// const searchInvoiceById = async (id) => {

// };

exports.PostCreditBookToCRM = async (creditnote) => {
    console.log("creditnote");
    console.log(creditnote);
    console.log('invoice id');
    console.log(creditnote.creditnote.invoice_id);

    const invoiceData = await invoiceSearchById(creditnote.creditnote.invoice_id);
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
        console.log(creditnoteData);

        const response = await postCreditNote(creditnoteData, invoiceId);
        console.log('creditnote posted to Zoho CRM successfully:', response.data);
    }

    catch (error) {
        console.log('Error posting invoice to Zoho CRM:', error.response ? error.response.data : error);
    }
};


// function check(id) {
//     searchInvoiceById(id).then((res) => {
//         console.log(res)
//     }).catch((error) => {
//         console.log(error)
//     })

// }

// check(1155413000073016058);