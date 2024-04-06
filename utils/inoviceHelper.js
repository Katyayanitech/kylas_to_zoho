const axios = require('axios');

// const postLead = async (leadData) => {
//     const config = {
//         method: 'post',
//         url: 'https://www.zohoapis.in/crm/v2/Leads',
//         headers: {
//             'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
//             'Content-Type': 'application/json'
//         },
//         data: JSON.stringify(leadData)
//     };

//     try {
//         return await axios(config);
//     } catch (error) {
//         console.log('Error in postLead function:', error);
//         throw error;
//     }
// }

async function deleteInvoiceById(id) {
    try {
        const url = `https://www.zohoapis.in/crm/v2/Invoices/${id}`;

        const response = await axios.delete(url, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Invoice deleted successfully:', response.data);
    } catch (error) {
        console.error('Error deleting invoice:', error.response ? error.response.data : error);
    }
}

exports.deleteInvoiceToZohoCRM = async (invoice) => {
    console.log("Invoice data");
    console.log(invoice);
    console.log(invoice.invoice.invoice_id);
    const invoice_id = invoice.invoice.invoice_id;
    try {
        const url = `https://www.zohoapis.in/crm/v2/Invoices/search?criteria=(Book_Id:equals:${invoice_id})`;
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        const crmId = response.data.data[0].id;

        await deleteInvoiceById(crmId);

        console.log('Invoice Deleted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.log('Error posting lead to Zoho CRM:', error.response ? error.response.data : error);
    }
}