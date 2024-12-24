const request = require('supertest');
const express = require('express');
const { Init_Feedback } = require('./feedback.controller');

jest.mock('./feedback.service', () => ({
  FeedbackService: {
    createFeedback: jest.fn(),
    getAllFeedback: jest.fn(),
    getFeedbackByCustomerId: jest.fn(),
    deleteFeedback: jest.fn(),
  },
}));

const { FeedbackService } = require('./feedback.service');

describe('Feedback Controller (E2E)', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    Init_Feedback(app);
  });

  describe('POST /feedback', () => {
    it('should create feedback and return 201 status', async () => {
      const feedbackData = { customer_id: '123', description: 'Great service', rating: 9 };
      const createdFeedback = { ...feedbackData, _id: 'mockId' };

      // Mock the service to return the created feedback
      FeedbackService.createFeedback.mockResolvedValue(createdFeedback);

      const response = await request(app).post('/feedback').send(feedbackData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdFeedback);  // Response body should match createdFeedback
      expect(FeedbackService.createFeedback).toHaveBeenCalledWith(feedbackData);  // Ensure it was called with correct data
    });

    it('should return 400 for validation errors', async () => {
      const errorMessage = 'Validation error';

      // Mock service to simulate validation error
      FeedbackService.createFeedback.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).post('/feedback').send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: errorMessage });
    });
  });

  describe('GET /feedback', () => {
    it('should return all feedback with 200 status', async () => {
      const feedbackList = [
        { customer_id: '123', description: 'Great', rating: 9 },
        { customer_id: '124', description: 'Good', rating: 8 },
      ];

      // Mock service to return all feedback
      FeedbackService.getAllFeedback.mockResolvedValue(feedbackList);

      const response = await request(app).get('/feedback');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(feedbackList);  // Response should match the mocked feedback list
    });

    it('should return 500 on server error', async () => {
      const errorMessage = 'Server error';

      // Mock service to simulate server error
      FeedbackService.getAllFeedback.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).get('/feedback');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: errorMessage });
    });
  });

  describe('GET /feedback/customer/:customer_id', () => {
    it('should return feedback for a specific customer', async () => {
      const customerId = '123';
      const feedback = [
        { customer_id: customerId, description: 'Great', rating: 9 },
      ];

      // Mock service to return feedback for the customer
      FeedbackService.getFeedbackByCustomerId.mockResolvedValue(feedback);

      const response = await request(app).get(`/feedback/customer/${customerId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(feedback);  // Response should match the mocked feedback
    });

    it('should return 404 if no feedback is found for a customer', async () => {
      const customerId = '999';  // Non-existent customer

      // Mock service to return an empty array (no feedback)
      FeedbackService.getFeedbackByCustomerId.mockResolvedValue([]);

      const response = await request(app).get(`/feedback/customer/${customerId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'No feedback found for this customer.' });
    });

    it('should return 500 on server error', async () => {
      const customerId = '123';
      const errorMessage = 'Server error';

      // Mock service to simulate a server error
      FeedbackService.getFeedbackByCustomerId.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).get(`/feedback/customer/${customerId}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: errorMessage });
    });
  });

  describe('DELETE /feedback/:feedback_id', () => {
    it('should delete feedback and return 200 status', async () => {
      const feedbackId = 'mockId';

      // Mock service to simulate successful deletion
      FeedbackService.deleteFeedback.mockResolvedValue(true);

      const response = await request(app).delete(`/feedback/${feedbackId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Feedback deleted successfully.' });
      expect(FeedbackService.deleteFeedback).toHaveBeenCalledWith(feedbackId);  // Ensure correct feedbackId was passed
    });

    it('should return 404 if feedback is not found', async () => {
      const feedbackId = 'mockId';
      const errorMessage = 'Feedback not found';

      // Mock service to simulate feedback not found error
      FeedbackService.deleteFeedback.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).delete(`/feedback/${feedbackId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: errorMessage });
    });
  });
});
