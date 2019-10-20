const Menu = require('../models/menu');
const MenuCategory = require('../models/menuCategory');
const Img = require('../models/img');

module.exports = {
    getById: async (id) => {
        const doc = await Menu.findById(id);
        return doc;
    },
    getByCompany: async (companyId) => {
        const docs = await Menu.find({ companyId });
        return docs;
    },
    add: async (data) => {
        const { companyId, name, description, image } = data;
        const menu = new Menu({ companyId, name, description });
        const savedMenu = await menu.save();
        const img = new Img({ itemId: savedMenu._id, url: image });
        const savedImg = await img.save();
        savedMenu.image = savedImg;
        await savedMenu.save();
    },
    update: async (data) => {
        const { id, name, description, image } = data;
        const doc = await Menu.findById(id);
        doc.name = name === '' ? doc.name : name;
        doc.description = description === '' ? doc.description : description;
        if (image !== '') {
            const img = await Img.findById(doc.image._id);
            img.url = image;
            const savedImg = await img.save();
            doc.image = savedImg;
        }
        await doc.save();
    },
    delete: async (id) => {
        const menu = await Menu.findById(id).select('companyId');
        const docs = await MenuCategory.find({ menuId: id });
        if (docs.length === 0) {
            await Img.deleteMany({ itemId: id });
            await Menu.deleteOne({ _id: id });
            return menu.companyId;
        } else {
            return false;
        }
    }
}