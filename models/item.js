const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    menuItemId: String,
    name: String,
    description: String,
    calories: {},
    image: {}
});

module.exports = mongoose.model("Item", itemSchema);