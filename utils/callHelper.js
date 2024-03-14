const axios = require('axios');

const PostCall = async (Calldata) => {
    const config = {
        method: 'post',
        url: 'https://www.zohoapis.in/crm/v2/Calls',
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(Calldata)
    };

    try {
        return await axios(config);
    } catch (error) {
        console.error('Error in postCall function:', error);
        throw error;
    }
}

exports.PostCallzoho = async (call) => {
    console.log("Call Data ");
    console.log(call);

    const startTime = new Date(call.entity.startTime);
    const formattedStartTime = startTime.toISOString();
    console.log(formattedStartTime);
    try {
        const Calldata = {
            data: [
                {
                    "Call_Duration": call.entity.duration || "",
                    "Description": call.entity.callRecording != null ? call.entity.callRecording.url : "",
                    "Call_Start_Time": formattedStartTime || "",
                    "Call_Type": call.entity.callType || "",
                    "Dialled_Number": call.entity.phoneNumber || "",
                    "Call_Status": call.entity.outcome || ""
                }
            ],
        };

        const response = await PostCall(Calldata);
        console.log('Deal posted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.error('Error posting Deal to Zoho CRM:', error.response ? error.response.data : error);
    }
}