const express = require('express');
const Company = require('../controllers/company');

const router = express.Router();

router.get('/companies', async (req, res) => {
    const docs = await Company.get();
    res.json(docs);
});

module.exports = router;