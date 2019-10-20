const express = require('express');

// requiring controllers..
const MenuCategory = require('../controllers/menuCategory');
const MenuItem = require('../controllers/menuItem');

const router = express.Router();

router.get('/:id', async (req, res) => {
    if (req.params.id) {
        const menuCategory = await MenuCategory.getById(req.params.id);
        const menuItems = await MenuItem.getByCategory(req.params.id);
        res.render('menuCategory', { menuCategory, menuItems });
    } else {
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    }
});

router.post('/', async (req, res) => {
    if (req.body.menuId && req.body.name && req.body.description && req.body.image) {
        await MenuCategory.add(req.body);
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.send('Please fill in all required fields!');
    }
});

router.post('/update', async (req, res) => {
    if (req.body.id) {
        await MenuCategory.update(req.body);
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.send('ID is required for update!');
    }
});

router.post('/delete', async (req, res) => {
    if (req.body.id && req.body.confirm) {
        if (req.body.confirm === '12345') {
            const result = await MenuCategory.delete(req.body.id);
            if (!result) {
                res.send('Cannot delete Menu Category: it contains Menu Items! Please delete the Menu Items and try again!');
            } else {
                res.redirect(`/menus/${ result }`);
            }
        } else {
            res.send('Delete confirmation code is wrong!');
        }
    } else {
        res.send('Menu Category ID and correct confirmation code (12345) are required for delete!');
    }
});

module.exports = router;