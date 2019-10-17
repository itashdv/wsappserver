const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    hash: String
});

module.exports = mongoose.model("Admin", adminSchema);