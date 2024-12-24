// Mocking bcrypt to avoid native binding issues during tests
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn().mockResolvedValue(true),
}));

const request = require('supertest');
const express = require('express');
const { Init_User } = require('./user.controller');
const { UserService } = require('./user.service');
const { auth } = require('../../auth');

// Create an express app instance for testing
const app = express();
app.use(express.json());
Init_User(app);

jest.mock('./user.service'); // Mock UserService methods
jest.mock('../../auth', () => ({
    auth: jest.fn().mockImplementation(() => (req, res, next) => next()),  // Bypass auth
}));

describe('User API', () => {

    // Test for creating a new user
    it('should create a new user successfully', async () => {
        const userData = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123',
            phone_num: '1234567890',
            role: 'customer',
            address: '123 Test St',
        };

        // Mock the createUser method to return the user data
        UserService.createUser.mockResolvedValue(userData);

        const response = await request(app)
            .post('/user')
            .send(userData);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(userData);
        expect(UserService.createUser).toHaveBeenCalledTimes(1); // Ensure createUser method is called once
    });

    // Test for getting all users
    it('should return all users', async () => {
        const users = [
            { email: 'user1@example.com', username: 'user1', role: 'customer' },
            { email: 'user2@example.com', username: 'user2', role: 'admin' }
        ];

        // Mock the getAllUsers method to return the users array
        UserService.getAllUsers.mockResolvedValue(users);

        const response = await request(app).get('/user');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(users);
    });

    // Test for getting a user by ID
    it('should return a user by ID', async () => {
        const userId = 'user123';
        const user = { _id: userId, email: 'user@example.com', username: 'user' };

        // Mock the getUserById method to return the user
        UserService.getUserById.mockResolvedValue(user);

        const response = await request(app).get(`/user/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(user);
    });

    // Test for handling user not found by ID
    it('should return 404 when user is not found by ID', async () => {
        const userId = 'nonexistentId';

        // Mock the getUserById method to throw an error
        UserService.getUserById.mockRejectedValue(new Error('User not found'));

        const response = await request(app).get(`/user/${userId}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });

    // Test for login
    it('should login user successfully', async () => {
        const loginData = { email: 'test@example.com', password: 'password123' };
        const user = { _id: 'user123', email: 'test@example.com', role: 'customer' };

        // Mock the login method to return the user and token
        UserService.login.mockResolvedValue({
            token: 'fake-jwt-token',
            user: user,
        });

        const response = await request(app)
            .post('/user/login')
            .send(loginData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful');
        expect(response.body.user).toEqual(user);
        expect(response.body.token).toBe('fake-jwt-token'); // Ensure token is included
    });

    // Test for login failure (invalid credentials)
    it('should return 400 for invalid credentials', async () => {
        const loginData = { email: 'invalid@example.com', password: 'wrongpassword' };

        // Mock the login method to throw an error
        UserService.login.mockRejectedValue(new Error('Invalid credentials'));

        const response = await request(app)
            .post('/user/login')
            .send(loginData);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid credentials');
    });
});
