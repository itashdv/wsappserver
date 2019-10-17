const express = require('express');

// requiring controllers..
const Category = require('../controllers/category');
const Company = require('../controllers/company');

const router = express.Router();

router.get('/', async (req, res) => {
    const categories = await Category.get();
    res.render('categories', { categories });
});

router.get('/:id', async (req, res) => {
    if (req.params.id) {
        const category = await Category.getById(req.params.id);
        const companies = await Company.getByCategory(req.params.id);
        res.render('category', { category, companies });
    } else {
        res.redirect('/categories');
    }
});

router.post('/', async (req, res) => {
    if (req.body.name && req.body.icon) {
        await Category.add(req.body);
        res.redirect('/categories');
    } else {
        res.send('All fields are required!');
    }
});

router.post('/update', async (req, res) => {
    if (req.body.id) {
        await Category.update(req.body);
        const backUrl = req.header('Referer') || '/';
        res.redirect(backUrl);
    } else {
        res.send('ID is required for update!');
    }
});

router.post('/delete', async (req, res) => {
    if (req.body.id && req.body.confirm) {
        if (req.body.confirm === '12345') {
            const result = await Category.delete(req.body.id);
            if (result) {
                res.redirect('/categories');
            } else {
                res.send('Cannot delete category: it contains companies! Please delete the companies in the category and try again!');
            }
        } else {
            res.send('Delete confirmation code is wrong! Please type numbers from 1 to 5 without spaces.');
        }
    } else {
        res.send('Category ID and correct confirmation code (12345) are required for delete!');
    }
});

module.exports = router;