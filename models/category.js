const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    icon: {}
});

module.exports = mongoose.model("Category", categorySchema);