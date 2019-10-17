const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    companyId: String,
    name: String,
    description: String,
    image: String
});

module.exports = mongoose.model("Menu", menuSchema);