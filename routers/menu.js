const express = require('express');
const Menu = require('../models/menu');
const MenuItem = require('../models/menuItem');

const router = express.Router();

router.get('/:id', async (req, res) => {
    if (req.params.id) {
        const menu = await Menu.findById(req.params.id);
        const menuItems = await MenuItem.find();
        res.render('menu', { menu, menuItems });
    } else {
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    }
});

router.post('/', async (req, res) => {
    if (req.body.companyId && req.body.name && req.body.description && req.body.image) {
        const { companyId, name, description, image } = req.body;
        const menu = new Menu({
            companyId,
            name,
            description,
            image
        });
        await menu.save();
        res.redirect(`/companies/${ companyId }`);
    } else {
        res.send('All fields except Social Media (Instagram & Facebook) are required!');
    }
});

router.post('/update', async (req, res) => {
    if (req.body.id) {
        const { id, name, description, image } = req.body;
        let menu = await Menu.findById(id);
        menu.name = name === '' ? menu.name : name;
        menu.description = description === '' ? menu.description : description;
        menu.image = image === '' ? menu.image : image;
        await menu.save();
        res.redirect(`/menus/${ id }`);
    } else {
        res.send('ID is required!');
    }
});

router.post('/delete', async (req, res) => {
    if (req.body.id && req.body.companyId && req.body.confirm) {
        if (req.body.confirm === '12345') {
            const docs = await MenuItem.find({ menuId: req.body.id });
            if (docs.length === 0) {
                await Menu.deleteOne({ _id: req.body.id });
                res.redirect(`/companies/${ req.body.companyId }`);
            } else {
                res.send('Cannot delete menu: it contains menu items! Please delete the menu items in the menu and try again!');
            }
        } else {
            res.send('Delete confirmation code is wrong!');
        }
    } else {
        res.send('All fields are required!');
    }
});

module.exports = router;