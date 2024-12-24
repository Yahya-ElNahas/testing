const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Init_Order } = require('./order.controller');
const { Order } = require('./order.schema');
const { auth } = require('../../auth');

jest.mock('../../auth', () => ({
    auth: jest.fn(() => (req, res, next) => next()), // Mock authentication middleware
}));

let app;
let mongoServer;

beforeAll(async () => {
    // Set up in-memory MongoDB for testing
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Initialize the app and routes
    app = express();
    app.use(express.json());
    Init_Order(app);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Order Controller E2E Tests', () => {
    let createdOrderId;

    it('should create a new order', async () => {
        const newOrder = {
            destination: 'City A',
            payment_method: 'credit card',
            status: 'pending',
            details: ['item1', 'item2'],
            price: 100,
        };

        const response = await request(app).post('/order').send(newOrder);

        expect(response.status).toBe(201);
        expect(response.body.destination).toBe(newOrder.destination);
        expect(response.body.payment_method).toBe(newOrder.payment_method);
        expect(response.body.status).toBe(newOrder.status);
        expect(response.body.price).toBe(newOrder.price);

        createdOrderId = response.body._id; // Store the ID of the created order
    });

    it('should retrieve the created order by ID', async () => {
        const response = await request(app).get(`/order/${createdOrderId}`);

        expect(response.status).toBe(200);
        expect(response.body._id).toBe(createdOrderId);
        expect(response.body.destination).toBe('City A');
    });

    it('should retrieve all orders', async () => {
        const response = await request(app).get('/order');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should update the order', async () => {
        const updatedOrder = {
            destination: 'City B',
            status: 'completed',
        };

        const response = await request(app)
            .patch(`/order/${createdOrderId}`)
            .send(updatedOrder);

        expect(response.status).toBe(200);
        expect(response.body.destination).toBe(updatedOrder.destination);
        expect(response.body.status).toBe(updatedOrder.status);
    });

    it('should delete the order', async () => {
        const response = await request(app).delete(`/order/${createdOrderId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Order deleted successfully');
        expect(response.body.deletedOrder._id).toBe(createdOrderId);
    });

    it('should return 404 when trying to get a deleted order', async () => {
        const response = await request(app).get(`/order/${createdOrderId}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Order not found');
    });
});
