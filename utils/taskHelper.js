

const axios = require('axios');

const PostTask = async (Taskdata) => {
    const config = {
        method: 'post',
        url: 'https://www.zohoapis.in/crm/v2/Tasks',
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(Taskdata)
    };

    try {
        return await axios(config);
    } catch (error) {
        console.error('Error in postTask function:', error);
        throw error;
    }
}

exports.PostTaskzoho = async (task) => {
    console.log("Task Data");
    console.log(task);

    // if (deal.entity.estimatedClosureOn != null) {
    //     const closureDate = new Date(deal.entity.estimatedClosureOn);
    //     formattedClosureDate = `${closureDate.getFullYear()}-${(closureDate.getMonth() + 1).toString().padStart(2, '0')}-${closureDate.getDate().toString().padStart(2, '0')}`;
    // } else {
    //     formattedClosureDate = "";
    // }

    // try {
    //     const Dealdata = {
    //         data: [
    //             {
    //                 "Deal_Name": deal.entity.name || "",
    //                 "Amount": deal.entity.estimatedValue.value || "",
    //                 "Stage": (deal.entity.pipeline != null) ? (deal.entity.pipeline.stage.name || "") : "",
    //                 "Closing_Date": formattedClosureDate || "",
    //                 "Kylas_Deal_Owner": deal.entity.ownedBy.name || ""
    //             },
    //         ],
    //     };

    //     const response = await PostDeal(Dealdata);
    //     console.log('Deal posted to Zoho CRM successfully:', response.data);
    // } catch (error) {
    //     console.error('Error posting Deal to Zoho CRM:', error.response ? error.response.data : error);
    // }
}