const MenuItem = require('../models/menuItem');
const Img = require('../models/img');

module.exports = {
    getById: async (id) => {
        const doc = await MenuItem.findById(id);
        return doc;
    },
    getByCategory: async (menuCategoryId) => {
        const docs = await MenuItem.find({ menuCategoryId });
        return docs;
    },
    add: async (data) => {
        const { menuCategoryId, name, description, image } = data;
        const calories = {
            fats: '',
            carbs: '',
            proteins: ''
        };
        const menuItem = new MenuItem({ menuCategoryId, name, description, calories });
        const savedMenuItem = await menuItem.save();
        const img = new Img({ itemId: savedMenuItem._id, url: image });
        const savedImg = await img.save();
        savedMenuItem.image = savedImg;
        await savedMenuItem.save();
    },
    update: async (data) => {
        const { id, name, description, fats, carbs, proteins } = data;
        const doc = await MenuItem.findById(id);
        const calories = {
            fats: fats === '' ? doc.calories.fats : fats,
            carbs: carbs === '' ? doc.calories.carbs : carbs,
            proteins: proteins === '' ? doc.calories.proteins : proteins
        }
        doc.name = name === '' ? doc.name : name;
        doc.description = description === '' ? doc.description : description;
        doc.calories = calories;
        await doc.save();
    },
    delete: async (id) => {
        const menuItem = await MenuItem.findById(id);
        await Img.deleteMany({ itemId: menuItem._id });
        await MenuItem.deleteOne({ _id: id });
    }
}