const Item = require('../models/item');
const Img = require('../models/img');
const Allergen = require('../models/allergen');
const MenuItem = require('../models/menuitem');

module.exports = {
    add: async (data) => {
        const { menuItemId, name, description, image } = data;
        const calories = { fats: '', carbs: '', proteins: '' };
        const item = new Item({
            menuItemId,
            name,
            description,
            calories
        });
        const savedItem = await item.save();
        const img = new Img({
            itemId: savedItem.id,
            alt: savedItem.name,
            url: image
        });
        const savedImg = await img.save();
        savedItem.image = savedImg;
        await savedItem.save();
    },
    getById: async (id) => {
        const item = await Item.findById(id);
        return item;
    },
    update: async (data) => {
        const { id, name, description, fats, carbs, proteins } = data;
        let item = await Item.findById(id);
        let calories = {
            fats: fats === '' ? item.calories.fats : fats,
            carbs: carbs === '' ? item.calories.carbs : carbs,
            proteins: proteins === '' ? item.calories.proteins : proteins
        }
        item.name = name === '' ? item.name : name;
        item.description = description === '' ? item.description : description;
        item.calories = calories;
        await item.save();
    }
}