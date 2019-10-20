const mongoose = require('mongoose');

const menuCategorySchema = new mongoose.Schema({
    menuId: String,
    name: String,
    description: String,
    image: {}
});

module.exports = mongoose.model("MenuCategory", menuCategorySchema);