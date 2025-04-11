    const express = require('express');
    const exphbs = require('express-handlebars');
    const session = require('express-session');
    const flash = require('connect-flash');
    const passport = require('passport');
    const path = require('path');



    require('dotenv').config();
    const mongoose = require('mongoose');
    const db = process.env.MONGODB_URI;

    const app = express();

    // Passport config
    require('./config/passport')(passport);

    // Handlebars
    app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
    app.set('view engine', 'hbs');

    // Bodyparser
    app.use(express.urlencoded({ extended: false }));

    // Sessions
    app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    }));

    // Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // Flash
    app.use(flash());

    // Global variables
    app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
    });

    // Routes
    app.use('/', require('./routes/index'));
    app.use('/auth', require('./routes/auth'));
    app.set('views', path.join(__dirname, 'views'));



    mongoose.connect(db, {

    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
