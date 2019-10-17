const express = require('express');
const MenuItem = require('../models/menuItem');
const Item = require('../models/item');

const router = express.Router();

router.get('/:id', async (req, res) => {
    if (req.params.id) {
        const menuItem = await MenuItem.findById(req.params.id);
        const items = await Item.find({ menuItemId: req.params.id });
        res.render('menuitem', { menuItem, items });
    } else {
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    }
});

router.post('/', async (req, res) => {
    if (req.body.menuId && req.body.name && req.body.description && req.body.image) {
        const { menuId, name, description, image } = req.body;
        const menuItem = new MenuItem({
            menuId,
            name,
            description,
            image
        });
        await menuItem.save();
        res.redirect(`/menus/${ menuId }`);
    } else {
        res.send('All fields are required!');
    }
});

router.post('/update', async (req, res) => {
    if (req.body.id) {
        const { id, name, description, image } = req.body;
        let menuItem = await MenuItem.findById(id);
        menuItem.name = name === '' ? menuItem.name : name;
        menuItem.description = description === '' ? menuItem.description : description;
        menuItem.image = image === '' ? menuItem.image : image;
        await menuItem.save();
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.send('ID is required!');
    }
});

router.post('/delete', async (req, res) => {
    if (req.body.id && req.body.menuId && req.body.confirm) {
        if (req.body.confirm === '12345') {
            const docs = await Item.find({ menuItemId: req.body.id });
            if (docs.length === 0) {
                await MenuItem.deleteOne({ _id: req.body.id });
                res.redirect(`/menus/${ req.body.menuId }`);
            } else {
                res.send('Cannot delete menu item: it contains items! Please delete the items and try again!');
            }
        } else {
            res.send('Delete confirmation code is wrong!');
        }
    } else {
        res.send('All fields are required!');
    }
});

module.exports = router;