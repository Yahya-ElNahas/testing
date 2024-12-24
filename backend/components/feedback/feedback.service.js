const { FeedbackRepository } = require('./feedback.repository');

module.exports.FeedbackService = {
    async getAllFeedback() {
        return await FeedbackRepository.findAll();
    },
    async getFeedbackByCustomerId(customerId) {
        return await FeedbackRepository.findByCustomerId(customerId);
    },
    async createFeedback(feedbackData) {
        return await FeedbackRepository.create(feedbackData);
    },
    async deleteFeedback(feedbackId) {
        const deletedFeedback = await FeedbackRepository.deleteById(feedbackId);
        if (!deletedFeedback) throw new Error('Feedback not found');
        return deletedFeedback;
    },
};