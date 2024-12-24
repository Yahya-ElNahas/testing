const {FeedbackService} = require('./feedback.service');
const { decryptToken } = require('../../auth')

module.exports.Init_Feedback = (app) => {
    app.post('/feedback', async (req, res) => {
        try {
            const body = req.body;
            body['customer_id'] = decryptToken(req).id;
            const feedback = await FeedbackService.createFeedback(body);
            res.status(201).json(feedback);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    app.get('/feedback', async (req, res) => {
        try {
            const feedback = await FeedbackService.getAllFeedback();
            res.status(200).json(feedback);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.get('/feedback/customer/:customer_id', async (req, res) => {
        try {
            const feedback = await FeedbackService.getFeedbackByCustomerId(req.params.customer_id);
            if (!feedback.length) {
                return res.status(404).json({ message: 'No feedback found for this customer.' });
            }
            res.status(200).json(feedback);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};