const express = require('express');
const Img = require('../models/img');
const extractArr = require('../utils/extractArr');
const extractAllergens = require('../utils/extractAllergens');

// requiring controller..
const Item = require('../controllers/item');
const Allergen = require('../controllers/allergen');
const MenuItem = require('../controllers/menuitem');

const router = express.Router();

router.get('/:id', async (req, res) => {
    if (req.params.id) {
        const item = await Item.getById(req.params.id);
        const allergens = await Allergen.get();
        const menuItems = await MenuItem.get();
        res.render('item', { item, allergens, menuItems });
    } else {
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    }
});

router.post('/', async (req, res) => {
    if (req.body.name &&
        req.body.description &&
        req.body.image &&
        req.body.menuItemId
    ) {
        await Item.add(req.body);
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.send('Please fill in the required fields!');
    }
});

router.post('/update', async (req, res) => {
    if (req.body.id) {
        await Item.update(req.body);
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.send('ID is required for update!');
    }
});

router.post('/image', async (req, res) => {
    if (req.body.itemId && req.body.alt && req.body.url) {
        const { itemId, alt, url } = req.body;
        let img = new Img({ itemId, alt, url });
        await img.save();
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.send('No images selected!');
    }
});

router.post('/allergens/add', async (req, res) => {
    if (req.body.itemId) {
        const allergens = await extractArr(req.body.allergens, req.body.itemId);
        Allergen.insertMany(allergens, (err, docs) => {
            if (err) throw err;
            res.redirect(`/items/${ req.body.itemId }`);
        });
    } else {
        res.send('No item ID selected!');
    }
});

router.post('/allergens/delete', async (req, res) => {
    if (req.body.id) {
        await Allergen.deleteOne({ _id: req.body.id });
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.send('ID is required for deleting!');
    }
});

module.exports = router;