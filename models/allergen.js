const mongoose = require('mongoose');

const allergenSchema = new mongoose.Schema({
    itemId: String,
    name: String
});

module.exports = mongoose.model("Allergen", allergenSchema);