const axios = require('axios');
const moment = require('moment');

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
        console.log('Error in postTask function:', error);
        throw error;
    }
}

exports.PostTaskzoho = async (task) => {
    console.log(task);
    let entityType;
    let entityId;
    let entityName;
    let entityNumber;
    const dueDate = new Date(task.entity.dueDate);
    const formattedDueDate = `${dueDate.getFullYear()}-${(dueDate.getMonth() + 1).toString().padStart(2, '0')}-${dueDate.getDate().toString().padStart(2, '0')}`;
    if (task.entity.relations != null) {
        entityType = task.entity.relations[0].entityType;
        entityId = task.entity.relations[0].entityId;

        if (entityType === "LEAD") {
            try {
                const response = await axios.get(`https://api.kylas.io/v1/leads/${entityId}`, {
                    headers: {
                        'api-key': '1e8d51e4-de78-4394-b5a9-e9d10b1e72d2'
                    }
                });
                const leadData = response.data;
                entityName = leadData.lastName;
                if (leadData.phoneNumbers && leadData.phoneNumbers.length > 0) {
                    entityNumber = leadData.phoneNumbers[0].dialCode + leadData.phoneNumbers[0].value;
                } else {
                    console.log("No phone number available for this lead.");
                }
            } catch (e) {
                console.log("Error fetching lead data:", e.toString());
            }

        } else if (entityType === "DEAL") {
            try {
                const response = await axios.get(`https://api.kylas.io/v1/deals/${entityId}`, {
                    headers: {
                        'api-key': '1e8d51e4-de78-4394-b5a9-e9d10b1e72d2'
                    }
                });
                const leadData = response.data;
                entityName = leadData.lastName;
                if (leadData.phoneNumbers && leadData.phoneNumbers.length > 0) {
                    entityNumber = leadData.phoneNumbers[0].dialCode + leadData.phoneNumbers[0].value;
                } else {
                    console.log("No phone number available for this Deal.");
                }
            } catch (e) {
                console.log("Error fetching lead data:", e.toString());
            }
        }
        else if (entityType === "CONTACT") {
            try {
                const response = await axios.get(`https://api.kylas.io/v1/contacts/${entityId}`, {
                    headers: {
                        'api-key': '1e8d51e4-de78-4394-b5a9-e9d10b1e72d2'
                    }
                });
                const leadData = response.data;
                entityName = leadData.lastName;
                if (leadData.phoneNumbers && leadData.phoneNumbers.length > 0) {
                    entityNumber = leadData.phoneNumbers[0].dialCode + leadData.phoneNumbers[0].value;
                } else {
                    console.log("No phone number available for this Contact.");
                }
            } catch (e) {
                console.log("Error fetching lead data:", e.toString());
            }
        }
    }

    try {
        const Taskdata = {
            data: [
                {
                    "Subject": task.entity.name || "",
                    "Description": task.entity.description || "",
                    "Status": task.entity.status.name || "",
                    "Priority": task.entity.priority.name || "",
                    "Due_Date": formattedDueDate || "",
                    "send_notification": true,
                    "Send_Notification_Email": true,
                    "Kyla_s_Task_Id": task.entity.id.toString() || "",
                    "kylas_task_owner": task.entity.assignedTo.name || "",
                    "Entity": entityType || "",
                    "Assosiated_Name": entityName || "",
                    "Assosiated_Contact_Number": entityNumber || "",
                    "Entity_Id": entityId.toString() || "",
                    "Pipeline_Stage": task.entity.name.substring(task.entity.name.indexOf('{') + 1, task.entity.name.indexOf('}'))
                },
            ],
        };

        const response = await PostTask(Taskdata);
        // console.log('Task posted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.log('Error posting Task to Zoho CRM:', error.response ? error.response.data : error);
    }
}


// Update Task
const updateTask = async (taskData, taskId) => {
    const config = {
        method: 'put',
        url: `https://www.zohoapis.in/crm/v2/Tasks/${taskId}`,
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(taskData)
    };

    try {
        return await axios(config);
    } catch (error) {
        console.log('Error in updateTask function:', error);
        return null;
    }
}

const getTaskIdAndContactByKylasTaskId = async (kylasTaskId) => {
    const apiUrl = `https://www.zohoapis.in/crm/v2/Tasks/search?criteria=(Kyla_s_Task_Id:equals:${kylasTaskId})`;

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
        const taskData = response.data.data[0];
        return {
            id: taskData.id,
            AssociatedContactNumber: taskData.Assosiated_Contact_Number
        };
    } catch (error) {
        console.log('Error in getTaskIdAndContactByKylasTaskId function:', error);
        console.log('KylasTask Id and Number Not found:', kylasTaskId);
        return {
            id: '',
            AssociatedContactNumber: ''
        };;
    }
};

const checkCallHistory = async (phoneNumber) => {
    const url = `https://www.zohoapis.in/crm/v2/Calls/search?criteria=(Phone_Number:equals:${phoneNumber})`;

    const config = {
        method: 'get',
        url: url,
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await axios(config);
        const callData = response.data.data;

        const currentTime = moment();

        let totalDuration = 0;
        callData.forEach(call => {
            const callStartTime = moment(call.Call_Start_Time);
            const durationInSeconds = call.Call_Duration_in_seconds || 0;
            if (currentTime.diff(callStartTime, 'hours') <= 1) {
                totalDuration += durationInSeconds;
            }
        });

        return totalDuration >= 15;
    } catch (error) {
        console.log(`Error fetching or filtering calls: ${error}`);
        return false;
    }
}


exports.updateTaskToZohoCRM = async (task) => {
    const kylasTaskId = task.entity.id;
    const taskIdAndContact = await getTaskIdAndContactByKylasTaskId(kylasTaskId);
    const taskId = taskIdAndContact.id;
    const associatedContactNumber = taskIdAndContact.AssociatedContactNumber;
    const systemApproved = await checkCallHistory(associatedContactNumber);
    const dueDate = new Date(task.entity.dueDate);
    const formattedDueDate = `${dueDate.getFullYear()}-${(dueDate.getMonth() + 1).toString().padStart(2, '0')}-${dueDate.getDate().toString().padStart(2, '0')}`;

    try {
        const taskData = {
            data: [
                {
                    "Subject": task.entity.name || "",
                    "Description": task.entity.description || "",
                    "Status": systemApproved ? "System Approve" : (task.entity.status.name || ""),
                    "Priority": task.entity.priority.name || "",
                    "Due_Date": formattedDueDate || "",
                    "send_notification": true,
                    "Send_Notification_Email": true,
                    "Kyla_s_Task_Id": task.entity.id.toString() || "",
                    "kylas_task_owner": task.entity.assignedTo.name || "",
                    "System_Updated": systemApproved ? true : false,
                    "Pipeline_Stage": task.entity.name.substring(task.entity.name.indexOf('{') + 1, task.entity.name.indexOf('}'))
                },
            ],
        };

        const response = await updateTask(taskData, taskId);
        console.log('Task updated to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.log('Error updating Task to Zoho CRM:', error.response ? error.response.data : error);
    }
}