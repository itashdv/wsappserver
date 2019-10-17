const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const checkAuth = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, 'whoatemycat?', async (err, decoded) => {
            if (err) {
                res.redirect('/logout');
            } else {
                const admin = await Admin.findById(decoded.id);
                if (admin) {
                    res.locals.admin = admin;
                    next();
                } else {
                    res.redirect('/logout');
                }
            }
        });
    } else {
        res.redirect('/login');
    }
}

module.exports = checkAuth;