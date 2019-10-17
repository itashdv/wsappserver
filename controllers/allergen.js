const Allergen = require('../models/allergen');

module.exports = {
    // add: async (data) => {
    //     const { menuItemId, name, description, image } = data;
    //     const item = new Item({
    //         menuItemId,
    //         name,
    //         description
    //     });
    //     const savedItem = await item.save();
    //     const img = new Img({
    //         itemId: savedItem.id,
    //         alt: savedItem.name,
    //         url: image
    //     });
    //     const savedImg = await img.save();
    //     item.image = savedImg;
    //     await item.save();
    // },
    get: async (itemId) => {
        const allergens = await Allergen.find({ itemId });
        return allergens;
    }
}