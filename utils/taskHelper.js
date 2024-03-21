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
    let entityType;
    let entityId;
    let entityName;
    let entityNumber;
    console.log("task Data");
    console.log(task);
    const dueDate = new Date(task.entity.dueDate);
    const formattedDueDate = `${dueDate.getFullYear()}-${(dueDate.getMonth() + 1).toString().padStart(2, '0')}-${dueDate.getDate().toString().padStart(2, '0')}`;
    console.log("Formatted Due Date:", formattedDueDate);
    console.log(task.entity.relations);
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
                entityNumber = leadData.phoneNumbers[0].dialCode + leadData.data.phoneNumbers[0].value;
                console.log("entityName");
                console.log(entityName);
                console.log(entityId);
            } catch (e) {
                console.log(e.toString());
            }

        } else if (entityType === "DEAL") {
            try {
                const response = await axios.get(`https://api.kylas.io/v1/deals/${entityId}`, {
                    headers: {
                        'api-key': '1e8d51e4-de78-4394-b5a9-e9d10b1e72d2'
                    }
                });
                const dealData = response.data;
                entityName = dealData.data.lastName;
                entityNumber = dealData.data.phoneNumbers[0].dialCode + dealData.data.phoneNumbers[0].value;
                console.log("entityName");
                console.log(entityName);
                console.log(entityId);
            } catch (e) {
                console.log(e.toString());
            }
        }
        else if (entityType === "CONTACT") {
            try {
                const response = await axios.get(`https://api.kylas.io/v1/contacts/${entityId}`, {
                    headers: {
                        'api-key': '1e8d51e4-de78-4394-b5a9-e9d10b1e72d2'
                    }
                });
                const contactData = response.data;
                entityName = contactData.data.lastName;
                entityNumber = contactData.data.phoneNumbers[0].dialCode + contactData.data.phoneNumbers[0].value;
                console.log(entityType);
                console.log("entityName");
                console.log(entityName);
                console.log(entityId);
            } catch (e) {
                console.log(e.toString());
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
                    "kylas_task_owner": task.entity.assignedTo.name || ""
                },
            ],
        };

        const response = await PostTask(Taskdata);
        console.log('Task posted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.error('Error posting Task to Zoho CRM:', error.response ? error.response.data : error);
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
        console.error('Error in updateTask function:', error);
        throw error;
    }
}

const getTaskIdByKylasTaskId = async (kylasTaskId) => {
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
        return response.data.data[0].id;
    } catch (error) {
        console.log('Error in getTaskIdByKylasTaskId function:', error);
        console.log('KylasTask Id Not found:', kylasTaskId);
        throw error;
    }
};


exports.updateTaskToZohoCRM = async (task) => {
    console.log("task update section");
    console.log(task);

    const kylasTaskId = task.entity.id;
    const taskId = await getTaskIdByKylasTaskId(kylasTaskId);
    console.log("Task Id");
    console.log(taskId);
    const dueDate = new Date(task.entity.dueDate);
    const formattedDueDate = `${dueDate.getFullYear()}-${(dueDate.getMonth() + 1).toString().padStart(2, '0')}-${dueDate.getDate().toString().padStart(2, '0')}`;
    console.log("Formatted Due Date:", formattedDueDate);

    try {
        const taskData = {
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
                    "kylas_task_owner": task.entity.assignedTo.name || ""
                },
            ],
        };

        const response = await updateTask(taskData, taskId);
        console.log('Task updated to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.error('Error updating Task to Zoho CRM:', error.response ? error.response.data : error);
    }
}