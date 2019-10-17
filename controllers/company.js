const Company = require('../models/company');
const Img = require('../models/img');
const Menu = require('../models/menu');

module.exports = {
    get: async () => {
        const docs = await Company.find();
        return docs;
    },
    getById: async (id) => {
        const doc = await Company.findById(id);
        return doc;
    },
    getByCategory: async (categoryId) => {
        const docs = await Company.find({ categoryId });
        return docs;
    },
    getImgs: async (itemId) => {
        const docs = await Img.find({ itemId });
        return docs;
    },
    add: async (data) => {
        const {
            categoryId,
            name,
            description,
            address,
            website,
            phone,
            instagram,
            facebook,
            lat,
            lng,
            image
        } = data;
        const company = new Company({
            categoryId,
            name,
            description,
            address,
            website: website === '' ? '' : website,
            phone,
            instagram: instagram === '' ? '' : instagram,
            facebook: facebook === '' ? '' : facebook,
            lat,
            lng,
            image: {}
        });
        const savedCompany = await company.save();
        const img = new Img({
            itemId: savedCompany._id,
            url: image
        });
        const savedImg = await img.save();
        savedCompany.image = savedImg;
        await savedCompany.save();
        return savedCompany._id;
    },
    addImg: async (data) => {
        const { itemId, url } = data;
        const image = new Img({ itemId, url });
        await image.save();
    },
    update: async (data) => {
        const {
            id,
            categoryId,
            name,
            description,
            address,
            website,
            phone,
            instagram,
            facebook,
            lat,
            lng
        } = data;
        const company = await Company.findById(id);
        company.categoryId = categoryId === '' ? company.categoryId : categoryId;
        company.name = name === '' ? company.name : name;
        company.description = description === '' ? company.description : description;
        company.address = address === '' ? company.address : address;
        company.website = website === '' ? company.website : website;
        company.phone = phone === '' ? company.phone : phone;
        company.instagram = instagram === '' ? company.instagram : instagram;
        company.facebook = facebook === '' ? company.facebook : facebook;
        company.lat = lat === '' ? company.lat : lat;
        company.lng = lng === '' ? company.lng : lng;
        await company.save();
    },
    delete: async (id) => {
        const docs = await Menu.find({ companyId: id });
        if (docs.length === 0) {
            await Img.deleteMany({ itemId: id });
            await Company.deleteOne({ _id: id });
            return true;
        } else {
            return false;
        }
    }
}