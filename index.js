const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// config..
const connStr = 'mongodb+srv://itash:668Chadan110@vladmy-fs5uy.mongodb.net/wsapp?retryWrites=true&w=majority';
const port = process.env.PORT || 4000;

// initializing app..
const app = express();

// connecting to database..
mongoose.connect(connStr, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
	if (err) {
		console.log('Problem connecting to database!');
	} else {
		console.log('Connected to database!');
	}
});

// configuring middleware..
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: '10MB', extended: false }));
app.use(bodyParser.json({ limit: '10MB', extended: true }));
app.use(cors());

// setting the view engine..
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// check auth middleware..
const checkAuth = require('./utils/checkAuth');

// models..
const Admin = require('./models/admin');

// requiring routes..
const Category = require('./routers/category');
const Company = require('./routers/company');
// const Menu = require('./routers/menu');
// const MenuItem = require('./routers/menuItem');
// const Item = require('./routers/Item');

// main page..
app.get('/', checkAuth, async (req, res) => {
    res.render('home', {
        admin: res.locals.admin
    });
});

// login page..
app.get('/login', (req, res) => {
    if (req.cookies.jwt) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

app.post('/login', async (req, res) => {
    if (req.body.email && req.body.password) {
        const { email, password } = req.body;
        const docs = await Admin.find({ email });
        if (docs.length > 0) {
            const admin = docs[0];
            const result = bcrypt.compareSync(password, admin.hash);
            if (result) {
                const token = jwt.sign({ id: admin.id }, 'whoatemycat?');
                res.cookie('jwt', token);
                res.redirect('/');
            } else {
                res.send('Password incorrect!');
            }
        } else {
            res.send('Admin with the given email is not found!');
        }
    } else {
        res.send('All fields are required!');
    }
});

// sign up page..
app.get('/signup', (req, res) => {
    if (req.cookies.jwt) {
        res.redirect('/');
    } else {
        res.render('signup');
    }
});

app.post('/signup', async (req, res) => {
    if (req.body.name && req.body.email && req.body.password && req.body.password2) {
        if (req.body.password === req.body.password2) {
            const { name, email, password } = req.body;
            const docs = await Admin.find({ email: email });
            if (docs.length === 0) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                const admin = new Admin({ name, email, hash });
                await admin.save();
                res.send(`
                    <p>New admin successfully registered!</p>
                    <a href="/login">Login</a>
                `);
            } else {
                res.send('Admin with such email already exists! Please choose another email for signup!');
            }
        } else {
            res.send('Passwords do not match!');
        }
    } else {
        res.send('All fields are required!');
    }
});

// logging out..
app.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
});

// mounting routes..
app.use('/categories', checkAuth, Category);
app.use('/companies', checkAuth, Company);
// app.use('/menus', checkAuth, Menu);
// app.use('/menuitems', checkAuth, MenuItem);
// app.use('/items', checkAuth, Item);

app.get('*', (req, res) => {
    res.send(`
        <h1 style="text-align: center;">404</h1>
        <h2 style="text-align: center;">NOTHING FOUND!</h2>
    `);
});

app.listen(port, function() {
    console.log(`Server started on port ${ port }`);
});