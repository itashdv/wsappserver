const Category = require('../models/category');
const Company = require('../models/company');
const Img = require('../models/img');

module.exports = {

    get: async () => {
        const docs = await Category.find();
        return docs;
    },

    getById: async (id) => {
        const doc = Category.findById(id);
        return doc;
    },

    getName: async (id) => {
        const doc = await Category.findById(id);
        return doc.name;
    },

    add: async (data) => {
        const { name, icon } = data;
        const category = new Category({ name });
        const savedCategory = await category.save();
        const newIcon = new Img({
            itemId: savedCategory.id,
            url: icon
        });
        let savedIcon = await newIcon.save();
        savedCategory.icon = savedIcon;
        await savedCategory.save();
    },

    update: async (data) => {
        const { id, name, icon } = data;
        const doc = await Category.findById(id);
        doc.name = name === '' ? doc.name : name;
        if (icon !== '') {
            const img = await Img.findById(doc.icon._id);
            img.url = icon;
            const savedImg = await img.save();
            doc.icon = savedImg;
        }
        await doc.save();
    },

    delete: async (id) => {
        const docs = await Company.find({ categoryId: id });
        if (docs.length === 0) {
            await Img.deleteMany({ itemId: id });
            await Category.deleteOne({ _id: id });
            return true;
        } else {
            return false;
        }
    }

}