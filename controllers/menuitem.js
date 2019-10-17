const MenuItem = require('../models/menuItem');

module.exports = {
    get: async () => {
        const docs = await MenuItem.find();
        return docs;
    }
}