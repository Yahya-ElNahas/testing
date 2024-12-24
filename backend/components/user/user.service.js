// Service: Encapsulates business logic
const { UserRepository } = require('./user.repository');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../auth');
const { Menu } = require('../menu/menu.schema');

module.exports.UserService = {
    async getAllUsers() {
        return await UserRepository.findAll();
    },
    async getUserById(userId) {
        const user = await UserRepository.findById(userId);
        if (!user) throw new Error('User not found');
        return user;
    },
    async getUsersByRole(role) {
        return await UserRepository.findByRole(role);
    },
    async createUser(userData) {
        return await UserRepository.create(userData);
    },
    async updateUser(userId, updateData) {
        const updatedUser = await UserRepository.updateById(userId, updateData);
        if (!updatedUser) throw new Error('User not found');
        return updatedUser;
    },
    async deleteUser(userId) {
        const deletedUser = await UserRepository.deleteById(userId);
        if (!deletedUser) throw new Error('User not found');
        return deletedUser;
    },
    async addToCart(userId, itemId) {
        return await UserRepository.addToCart(userId, itemId);
    },
    async register(userData) {
        const existingUser = await UserRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email is already registered');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
        return await UserRepository.create(userData);
    },

    async login(email, password) {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = generateToken({id: user._id, role: user.role})

        return { token, user };
    },
    async getUserCartById(id) {
        const userCart = (await UserRepository.findById(id)).cart;
        const cart = [];
        for(const item of userCart) {
            const menuItem = await Menu.findById(item.item_id);
            const body = {
                name: menuItem.name,
                price: menuItem.price,
                description: menuItem.description,
                quantity: item.quantity
            }
            cart.push(body);
        }
        return cart;
    }
};