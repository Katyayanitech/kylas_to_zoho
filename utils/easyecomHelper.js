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

exports.postInvoiceToZohoBooks = async (invoice) => {
    console.log("easyecom invoice : ", invoice);
    // try {
    //     const leadData = {
    //         data: [
    //             {
    //                 First_Name: lead.entity.firstName || "",
    //                 Last_Name: lead.entity.lastName || "",
    //                 Phone: (lead.entity.phoneNumbers[0].dialCode + lead.entity.phoneNumbers[0].value) || "",
    //                 Email: (lead.entity.emails == null) ? "" : (lead.entity.emails[0].value),
    //                 City: lead.entity.city || "",
    //                 State: lead.entity.state || "",
    //                 Zip_Code: lead.entity.zipcode || "",
    //                 Lead_Source: lead.entity.source.value || "",
    //                 Kylas_Owner: lead.entity.ownerId.value || "",
    //                 Lead_Status: "Open",
    //                 Kylas_Lead_Id: lead.entity.id.toString(),
    //             },
    //         ],
    //     };

    //     // const response = await postLead(leadData);
    //     // console.log('easyecom invoice posted to Zoho books successfully:', response.data);
    // } catch (error) {
    //     console.log('Error posting easyecom invoice to Zoho books:', error.response ? error.response.data : error);
    // }
}

