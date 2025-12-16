const mongoose = require('mongoose');
require('dotenv').config();

const MenuItem = require('./models/MenuItem');

const menuItems = [
    { name: 'Pink Velvet Cupcake', price: 3.50, category: 'Cupcakes' },
    { name: 'Strawberry Swirl Cupcake', price: 3.00, category: 'Cupcakes' },
    { name: 'Cherry Blossom Cupcake', price: 3.25, category: 'Cupcakes' },
    { name: 'Rose Buttercream Cake', price: 25.00, category: 'Cakes' },
    { name: 'Strawberry Shortcake', price: 22.00, category: 'Cakes' },
    { name: 'Pink Confetti Celebration Cake', price: 28.00, category: 'Cakes' },
    { name: 'Frosted Sugar Cookies', price: 1.50, category: 'Cookies' },
    { name: 'Pink Macarons', price: 2.00, category: 'Cookies' },
    { name: 'Raspberry Thumbprint Cookies', price: 1.75, category: 'Cookies' },
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pink-treats-bakery');
        console.log('Connected to MongoDB');
        await MenuItem.deleteMany({});
        console.log('Cleared existing menu items');
        await MenuItem.insertMany(menuItems);
        console.log('Menu items seeded successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();