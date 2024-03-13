const { PostTaskzoho } = require("../utils/taskHelper");

exports.postTaskToCRM = async (req, res) => {
    try {
        const newTask = req.body;
        await PostTaskzoho(newTask);
        return res.status(200).send('Task processed successfully');
    } catch (error) {
        console.error('Error processing webhook request:', error);
        return res.status(500).send('Error processing webhook request');
    }
}