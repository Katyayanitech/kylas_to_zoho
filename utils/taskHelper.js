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

    const dueDate = new Date(task.entity.dueDate);
    console.log("Parsed Due Date:", dueDate);
    const formattedDueDate = `${dueDate.getFullYear()}-${(dueDate.getMonth() + 1).toString().padStart(2, '0')}-${dueDate.getDate().toString().padStart(2, '0')}`;
    console.log("Formatted Due Date:", formattedDueDate);

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
                },
            ],
        };

        const response = await PostTask(Taskdata);
        console.log('Task posted to Zoho CRM successfully:', response.data);
    } catch (error) {
        console.error('Error posting Task to Zoho CRM:', error.response ? error.response.data : error);
    }
}