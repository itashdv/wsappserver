const express = require('express');

// requiring controllers..
const Company = require('../controllers/company');
const Category = require('../controllers/category');
const Img = require('../controllers/img');

const router = express.Router();

router.get('/', async (req, res) => {
    const companies = await Company.get();
    const categories = await Category.get();
    res.render('companies', { companies, categories });
});

router.get('/:id', async (req, res) => {
    if (req.params.id) {
        const company = await Company.getById(req.params.id);
        const categoryName = await Category.getName(company.categoryId);
        const categories = await Category.get();
        const images = await Img.get(req.params.id);
        res.render('company', { company, categoryName, categories, images });
    } else {
        res.redirect('/companies');
    }
});

router.post('/', async (req, res) => {
    if (
        req.body.categoryId &&
        req.body.name &&
        req.body.description &&
        req.body.address &&
        req.body.phone &&
        req.body.image &&
        req.body.lat &&
        req.body.lng
    ) {
        const companyId = await Company.add(req.body);
        res.redirect(`/companies/${ companyId }`);
    } else {
        res.send('Please fill in all the required fields!');
    }
});

router.post('/image', async (req, res) => {
    if (req.body.itemId && req.body.url) {
        await Img.add(req.body);
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.send('Please fill in all the required fields!');
    }
});

router.post('/deleteimg', async (req, res) => {
    if (req.body.id && req.body.itemId) {
        const result = await Img.delete(req.body);
        if (result) {
            const backURL = req.header('Referer') || '/';
            res.redirect(backURL);
        }
        res.send('Cannot delete Profile Image!');
    } else {
        res.redirect('/companies');
    }
});

router.post('/setasprofileimg', async (req, res) => {
    if (req.body.id && req.body.itemId) {
        await Img.setProfile(req.body);
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.redirect('/companies');
    }
});

router.post('/update', async (req, res) => {
    if (req.body.id) {
        await Company.update(req.body);
        const backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    } else {
        res.send('ID is required for update!');
    }
});

router.post('/delete', async (req, res) => {
    if (req.body.id && req.body.confirm) {
        if (req.body.confirm === '12345') {
            const result = await Company.delete(req.body.id);
            if (result) {
                res.redirect('/companies');
            } else {
                res.send('Cannot delete company that contains menus! Please delete menus first.');
            }
        } else {
            res.send('Delete confirmation code is wrong! Please enter numbers from 1 to 5 without spaces!');
        }
    } else {
        res.send('Confirmation code (12345) and company ID are required for delete!');
    }
});

module.exports = router;