const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    companyId: String,
    name: String,
    description: String,
    image: {}
});

module.exports = mongoose.model("Menu", menuSchema);