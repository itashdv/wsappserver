const mongoose = require('mongoose');

const imgSchema = new mongoose.Schema({
    itemId: String,
    url: String
});

module.exports = mongoose.model("Img", imgSchema);