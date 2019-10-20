const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    menuCategoryId: String,
    name: String,
    description: String,
    calories: {},
    image: {}
});

module.exports = mongoose.model("MenuItem", menuItemSchema);