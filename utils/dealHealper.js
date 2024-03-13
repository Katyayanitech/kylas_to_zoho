const axios = require('axios');

const PostDeal = async (Dealdata) => {
    const config = {
        method: 'post',
        url: 'https://www.zohoapis.in/crm/v2/Deals',
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(Dealdata)
    };

    try {
        return await axios(config);
    } catch (error) {
        console.error('Error in postDeal function:', error);
        throw error;
    }
}

exports.PostDealzoho = async (deal) => {
    console.log("Deal Data ");
    console.log(deal);

    // try {
    //     // const Dealdata = {
    //     //     data: [
    //     //         {
    //     //             "Deal_Name": ,
    //     //             "Amount": ,
    //     //             "Stage": ,
    //     //             "Closing_Date": ,
    //     //             "Lead_Source": 
    //     //         },
    //     //     ],
    //     // };

    //     // const response = await PostDeal(Dealdata);
    //     // console.log('Deal posted to Zoho CRM successfully:', response.data);
    // } catch (error) {
    //     console.error('Error posting Deal to Zoho CRM:', error.response ? error.response.data : error);
    // }
}