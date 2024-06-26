// Import required modules
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');


const User = require('./models/userModel')
const Consultant = require('./models/consultantModel')
const Client = require('./models/clientModel')

const homeRoutes = require('./routes/homeRoutes')
const userRoutes = require('./routes/userRoutes');
const clientRoutes = require('./routes/clientRoutes');
const consultantRoutes = require('./routes/consultantRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
//const blogRoutes = require('./routes/blogRoutes');
//const contactInquiryRoutes = require('./routes/contactInquiryRoutes');


const dbUrl = process.env.DB_URL

// Set up the database connection
mongoose.connect(dbUrl);
const db = mongoose.connection;
// Check for database connection errors
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Set up the view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Set up middleware for parsing JSON and handling URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // This is for JSON data
app.use(methodOverride('_method'));
app.use(session({ secret: 'notagoodsecret' }));
app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')))

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up session handling middleware
const sessionConfig = {
    name: 'session',
    secret: 'your-secre-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

// Handle Flash
app.use(session(sessionConfig));
app.use(flash());

app.use(async (req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    /*
    if (req.user) {
        if (req.user.role === 'Consultant') {
            const consultant = await Consultant.findOne({ userId: req.user._id });
            res.locals.consultant = consultant;
        } else if (req.user.role === 'Client') {
            const client = await Client.findOne({ userId: req.user._id });
            res.locals.client = client;
        }
    } else {
        // If no user is logged in, set both client and consultant to null
        res.locals.client = null;
        res.locals.consultant = null;
    }*/

    if (req.user) {
        if (req.user.role === 'Consultant') {
            const consultant = await Consultant.findOne({ userId: req.user._id });
            res.locals.consultant = consultant;
        } else if (req.user.role === 'Client') {
            const client = await Client.findOne({ userId: req.user._id });
            res.locals.client = client;
        }
    } else {
        // If no user is logged in, set both client and consultant to null
        res.locals.client = null;
        res.locals.consultant = null;
    }

    next();
});


// Handle Routes
app.use('/', homeRoutes)
app.use('/user', userRoutes);
app.use('/client', clientRoutes);
app.use('/consultant', consultantRoutes);
app.use('/consultation', consultationRoutes);
app.use('/services', serviceRoutes);
app.use('/invoices', invoiceRoutes);
//app.use('/blogs', blogRoutes);
//app.use('/contact-inquiries', contactInquiryRoutes);

/*
// Handle Error Page
app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404 ))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
*/

const port = process.env.PORT || 3000;
// Start the server
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});