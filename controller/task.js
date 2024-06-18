const { PostTaskzoho, updateTaskToZohoCRM } = require("../utils/taskHelper");

exports.postTaskToCRM = async (req, res) => {
    try {
        const newTask = req.body;
        await PostTaskzoho(newTask);
        return res.status(200).send('Task processed successfully');
    } catch (error) {
        console.log('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}

exports.updateTaskToCRM = async (req, res) => {
    try {
        console.log(`Update Task Log ${req.body}`);
        const updatedTask = req.body;
        await updateTaskToZohoCRM(updatedTask);
        return res.status(200).send('Task Updated successfully');
    } catch (error) {
        console.log('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}