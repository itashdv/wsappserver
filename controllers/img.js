const Img = require('../models/img');
const Company = require('../models/company');
const { ObjectID } = require('mongoose').mongo;

module.exports = {
    get: async (itemId) => {
        const docs = await Img.find({ itemId });
        return docs;
    },
    add: async (data) => {
        const { itemId, url } = data;
        const image = new Img({ itemId, url });
        await image.save();
    },
    delete: async (data) => {
        const { id, itemId } = data;
        const company = await Company.findById(itemId);
        // console.log(id);
        // console.log(company.image._id);
        const objectID1 = new ObjectID(id);
        const objectID2 = new ObjectID(company.image._id);
        if (objectID1.equals(objectID2)) {
            return false;
        } else {
            await Img.deleteOne({ _id: id });
            return true;
        }
    },
    setProfile: async (data) => {
        const { id, itemId } = data;
        const img = await Img.findById(id);
        const company = await Company.findById(itemId);
        company.image = img;
        await company.save();
    }
}