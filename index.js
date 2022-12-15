
const db = require('./db.js');
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const port = 5500;
const { path } = require('file');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(fileUpload());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use(expressSession({
    secret: 'some secret',
    cookie: {maxAge: 30000000000000}, 
    resave: false,
    saveUninitialized: true
}))







app.get('/', (req, res) => {
    res.render('pages/main_page', {session: req.session});
});

app.get('/home', (req, res) => {
    res.render('pages/main_page', {session: req.session});
});

app.get('/history', (req, res) => {
    res.render('pages/history', {session: req.session});
});

app.get('/login', (req, res) => {
    res.render('pages/login', {session: req.session});
})

app.get('/user', (req, res) => {
    db.userLogin(req,res, {session: req.session});
});

app.get('/edit_profile', (req, res) => {
    db.updateUserInfo(req, res, {session: req.session});
})

app.post('/update_user', (req, res) => {
    db.updateUser(req, res, {session: req.session});
});

app.get('/edit_info', (req, res) => {
    res.render('pages/edit_info', {session: req.session})
});

app.get('/add_race', (req, res) => {
    res.render('pages/add_race', {session: req.session})
})

app.get('/add_driver', (req, res) => {
    db.driverRender(req, res, {session: req.session})
})

app.get('/remove_driver', (req, res) => {
    db.deleteDriverRender(req, res, {session: req.session})
})

app.get('/remove_race', (req, res) => {
    db.deleteRaceRender(req, res, {session: req.session})
})

app.get('/update_driver', (req, res) => {
    db.updateDriverRender(req, res, {session: req.session})
})

app.post('/add_race', (req, res) => {
    db.addRace(req, res, {session: req.session})
})

app.post('/add_driver', (req, res) => {
    db.addDrivers(req, res, {session: req.session})
})

app.post('/remove_driver', (req, res) => {
    db.removeDrivers(req, res, {session: req.session})
})

app.post('/remove_race', (req, res) => {
    db.deleteRace(req, res, {session: req.session})
})

app.post('/update_driver', (req, res) => {
    db.updateDrivers(req, res, {session: req.session})
})

app.get('/teams', (req, res) => {
    db.getTeams(req ,res, {session: req.session});
});

app.get('/races', (req, res) => {
    db.getRace(req, res, {session: req.session});
});

app.get('/standings', (req, res) => {
    db.getDrivers(req, res, {session: req.session});
})

app.post('/new_user', (req, res) => {
    db.addUser(req, res), {session: req.session};
})

app.post('/user', (req, res) => {
    db.userLogin(req,res), {session: req.session};
});

app.get('/logout', (req, res) => {
    req.session.loggedIn = false;
    res.redirect('home')
})





app.listen(port, () => {
    console.log(`listening on port ${port}`);
});