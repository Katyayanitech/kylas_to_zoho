const axios = require('axios');

const getZohoCRMRecordIdByName = async (module, name) => {
  try {
    const response = await axios.get(
      `https://www.zohoapis.in/crm/v2/${module}/search`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        params: {
          criteria: JSON.stringify({
            "condition": [
              {
                "field": "name",
                "operator": "equals",
                "value": name
              }
            ]
          }),
          scope: 'everything',
          selectColumns: 'id,name',
          limit: 1,
        },
      }
    );

    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0].id;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting Zoho CRM record ID by name:', error.response ? error.response.data : error);
    throw error;
  }
};

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
    const offsetMinutes = startTime.getTimezoneOffset();
    const offsetHours = Math.abs(offsetMinutes / 60);
    const offsetSign = offsetMinutes < 0 ? '+' : '-';

    const formattedStartTime = `${startTime.getFullYear()}-${(startTime.getMonth() + 1).toString().padStart(2, '0')}-${startTime.getDate().toString().padStart(2, '0')}T${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}:00${offsetSign}${offsetHours.toString().padStart(2, '0')}:${Math.abs(offsetMinutes % 60).toString().padStart(2, '0')}`;
    console.log(formattedStartTime);
    console.log(call.entity.relatedTo);

    let callType = "";
    if (call.entity.callType == "outgoing") {
        callType = "Outbound";
    } else if (call.entity.callType == "incoming") {
        callType = "Inbound";
    }

    try {
        const relatedEntity = call.entity.relatedTo[0];
        const relatedEntityId = await getZohoCRMRecordIdByName(relatedEntity.entity, relatedEntity.name);

        if (!relatedEntityId) {
          console.error(`Error: Could not find Zoho CRM record with name "${relatedEntity.name}" in module "${relatedEntity.entity}".`);
          throw new Error(`Could not find Zoho CRM record withname "${relatedEntity.name}" in module "${relatedEntity.entity}".`);
        }

        const Calldata = {
            data: [
                {
                    "Call_Duration": call.entity.duration || "",
                    "Description": call.entity.callRecording != null ? call.entity.callRecording.url : "",
                    "Call_Start_Time": formattedStartTime || "",
                    "Call_Type": callType || "",
                    "Dialled_Number": call.entity.phoneNumber || "",
                    "Call_Status": call.entity.outcome || "",
                    "What_Id": {
                        "id": relatedEntityId,
                        "name": relatedEntity.name,
                    },
                    "$se_module": "Accounts",
                }
            ],
        };

        const response = await PostCall(Calldata);
        console.log('Call posted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.error('Error posting Call to Zoho CRM:', error.response ? error.response.data : error);
    }
}