const express = require('express');
const MenuItem = require('../controllers/menuItem');
const Allergen = require('../controllers/allergen');
const Img = require('../controllers/img');

const router = express.Router();

router.get('/:id', async (req, res) => {
    if (req.params.id) {
        const menuItem = await MenuItem.getById(req.params.id);
        const allergens = await Allergen.getByItem(req.params.id);
        const images = await Img.get(req.params.id);
        res.render('menuItem', { menuItem, allergens, images });
    } else {
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    }
});

router.post('/', async (req, res) => {
    if (req.body.menuCategoryId && req.body.name && req.body.description && req.body.image) {
        await MenuItem.add(req.body);
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.send('All fields are required!');
    }
});

router.post('/update', async (req, res) => {
    if (req.body.id) {
        await MenuItem.update(req.body);
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.send('ID is required for update!');
    }
});

router.post('/allergen', async (req, res) => {
    if (req.body.itemId) {
        await Allergen.add(req.body);
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.send('Item ID is required!');
    }
});

router.post('/allergen/delete', async (req, res) => {
    if (req.body.id) {
        await Allergen.delete(req.body.id);
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.send('ID is required for delete!');
    }
});

router.post('/image', async (req, res) => {
    if (req.body.itemId && req.body.url) {
        await Img.add(req.body);
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.send('ID and image URL are required!');
    }
});

router.post('/deleteimg', async (req, res) => {
    if (req.body.id && req.body.itemId) {
        const result = await Img.deleteFromMenuItem(req.body);
        if (result) {
            const backURL = req.header('Referer') || '/';
            res.redirect(backURL);
        } else {
            res.send('Cannot delete Profile Image!');
        }
    } else {
        res.redirect(`/menuitems/${ req.body.itemId }`);
    }
});

router.post('/setasprofileimg', async (req, res) => {
    if (req.body.id && req.body.itemId) {
        await Img.setProfileImageMenuItem(req.body);
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.redirect(`/menuitems/${ req.body.itemId }`);
    }
});

router.post('/delete', async (req, res) => {
    if (req.body.id && req.body.menuCategoryId && req.body.confirm) {
        if (req.body.confirm === '12345') {
            await MenuItem.delete(req.body.id);
            res.redirect(`/menucategories/${ req.body.menuCategoryId }`);
        } else {
            res.send('Delete confirmation code is wrong!');
        }
    } else {
        res.send('All fields are required for delete!');
    }
});

module.exports = router;