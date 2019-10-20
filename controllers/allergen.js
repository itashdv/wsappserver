const Allergen = require('../models/allergen');

module.exports = {
    add: async (data) => {
        const { itemId, name } = data;
        const allergen = new Allergen({ itemId, name });
        await allergen.save();
    },
    getByItem: async (itemId) => {
        const docs = await Allergen.find({ itemId });
        return docs;
    },
    delete: async (id) => {
        await Allergen.deleteOne({ _id: id });
    }
}