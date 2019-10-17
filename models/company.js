const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    categoryId: String,
    name: String,
    description: String,
    address: String,
    website: String,
    phone: String,
    instagram: String,
    facebook: String,
    image: {},
    lat: String,
    lng: String
});

module.exports = mongoose.model("Company", companySchema);