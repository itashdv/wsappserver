const MenuCategory = require('../models/menuCategory');
const Img = require('../models/img');
const MenuItem = require('../models/menuItem');

module.exports = {
    add: async (data) => {
        const { menuId, name, description, image } = data;
        const menuCategory = new MenuCategory({ menuId, name, description });
        const savedMenuCategory = await menuCategory.save();
        const img = new Img({ itemId: savedMenuCategory._id, url: image });
        const savedImg = await img.save();
        savedMenuCategory.image = savedImg;
        await savedMenuCategory.save();
    },
    getById: async (id) => {
        const doc = await MenuCategory.findById(id);
        return doc;
    },
    getByMenu: async (menuId) => {
        const docs = await MenuCategory.find({ menuId });
        return docs;
    },
    update: async (data) => {
        const { id, name, description, image } = data;
        const doc = await MenuCategory.findById(id);
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
        const menuCategory = await MenuCategory.findById(id).select('menuId');
        const docs = await MenuItem.find({ menuCategoryId: id });
        if (docs.length === 0) {
            await Img.deleteMany({ itemId: id });
            await MenuCategory.deleteOne({ _id: id });
            return menuCategory.menuId;
        } else {
            return false;
        }
    }
}