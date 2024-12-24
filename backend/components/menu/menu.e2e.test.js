const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { Menu } = require('./menu.schema');
const { Init_Menu } = require('./menu.api');
const { auth } = require('../../auth');

// Create an express app instance for testing
const app = express();
app.use(express.json());
Init_Menu(app);

// Mock the Menu model methods
jest.mock('./menu.schema');
jest.mock('../../auth', () => ({
  auth: jest.fn().mockImplementation(() => (req, res, next) => next()), // Bypass auth
}));

// In-memory database URL for testing
const mongoURI = 'mongodb://localhost:27017/test';

beforeAll(async () => {
  // Connect to the in-memory MongoDB instance
  await mongoose.connect(mongoURI);
});

afterAll(async () => {
  // Cleanup database and close connection after tests
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Menu API E2E Tests', () => {
  // Test for creating a new menu item
  it('should create a new menu item successfully', async () => {
    const menuItemData = {
      type: 'beverage',
      name: 'Coffee',
      price: 3.5,
      description: 'Freshly brewed coffee',
      extra_property: 'Medium',
    };

    const savedMenuItem = {
      ...menuItemData,
      _id: new mongoose.Types.ObjectId(),
    };

    const displayedItem = `${savedMenuItem.name} - $${savedMenuItem.price}: ${savedMenuItem.description} (Size: ${savedMenuItem.extra_property})`;

    // Mock the save method to return the saved menu item
    const mockSave = jest.fn().mockResolvedValue(savedMenuItem);
    Menu.prototype.save = mockSave;

    const response = await request(app)
      .post('/menu')
      .send(menuItemData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Menu item created successfully');
    expect(response.body.item).toBe(displayedItem); // Match the string output from display()
    expect(mockSave).toHaveBeenCalledTimes(1); // Ensure save method is called once
  });

  // Test for getting all menu items
  it('should return all menu items', async () => {
    const menuItems = [
      { name: 'Coffee', price: 3.5, description: 'Freshly brewed coffee', type: 'beverage', extra_property: 'Medium' },
      { name: 'Cake', price: 4.0, description: 'Delicious chocolate cake', type: 'dessert', extra_property: '300 kcal' },
    ];

    // Mock the find method to return the menu items array
    Menu.find.mockResolvedValue(menuItems);

    const response = await request(app).get('/menu');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(menuItems);
  });

  // Test for updating a menu item's price
  it('should update menu item price successfully', async () => {
    const menuItemId = new mongoose.Types.ObjectId(); // Generate a valid ObjectId
    const newPrice = 4.0;

    const menuItem = {
      _id: menuItemId,
      name: 'Coffee',
      price: 3.5,
      description: 'Freshly brewed coffee',
      type: 'beverage',
      extra_property: 'Medium',
      save: jest.fn().mockResolvedValue({
        _id: menuItemId,
        name: 'Coffee',
        price: newPrice,
      }),
    };

    // Mock findById to return the mock menu item document
    Menu.findById.mockResolvedValue(menuItem);

    const response = await request(app)
      .patch(`/menu/${menuItemId}/change-price`)
      .send({ newPrice });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Price updated successfully');
    expect(response.body.item.price).toBe(newPrice);
    expect(menuItem.save).toHaveBeenCalledTimes(1); // Ensure save method is called once
  });

  // Test for deleting a menu item
  it('should delete a menu item successfully', async () => {
    const menuItemId = new mongoose.Types.ObjectId(); // Generate a valid ObjectId
    const deletedMenuItem = { _id: menuItemId, name: 'Coffee', price: 3.5, description: 'Freshly brewed coffee' };

    // Mock findByIdAndDelete to return the deleted menu item
    Menu.findByIdAndDelete.mockResolvedValue(deletedMenuItem);

    const response = await request(app).delete(`/menu/${menuItemId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Menu item deleted successfully');
    expect(response.body.deletedItem._id.toString()).toBe(menuItemId.toString());
  });

  // Test for handling menu item not found on delete
  it('should return 404 when menu item is not found for deletion', async () => {
    const menuItemId = new mongoose.Types.ObjectId(); // Generate a valid ObjectId

    // Mock findByIdAndDelete to return null (menu item not found)
    Menu.findByIdAndDelete.mockResolvedValue(null);

    const response = await request(app).delete(`/menu/${menuItemId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Menu item not found'); // Updated test to match actual response
  });
});
