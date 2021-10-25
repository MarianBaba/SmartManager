const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Company = require('../models/company');
const passport = require('passport');

router.get('/', function (req, res) { //route della landing page
    try { //prova a fare il render della pagina hompage contenuta nel folder views/frontpage
        res.render('frontpage/homepage.ejs');
    } catch (err) { //se la pagina non viene trovata o c'è un errore nel server, si viene inviati a una pagina di errore
        res.status(404); //viene inviato uno status 404 al browser
        res.redirect('/error');
    }
});

router.get('/soluzioni', function (req, res) {
    try {
        res.render('frontpage/solutions.ejs');
    } catch (err) {
        res.status(404);
        res.redirect('/error');
    }
})

router.get('/perchenoi', function (req, res) {
    try {
        res.render('frontpage/whyUs.ejs');
    } catch (err) {
        res.status(404);
        res.redirect('/error');
    }
})

router.get('/aboutus', function (req, res) {
    try {
        res.render('frontpage/aboutUs.ejs');
    } catch (err) {
        res.status(404);
        res.redirect('/error');
    }
})

router.get('/error', function (req, res) {
    try {
        res.render('error.ejs');
    } catch (err) {
        res.status(404);
    }
})

//MOSTRA FORM DI REGISTRAZIONE
router.get('/register', function (req, res) {
    res.render('frontpage/register.ejs');
})

//REGISTRA UN UTENTE
router.post('/register', function (req, res) {
    let newCompany = new Company({
        name: req.body.companyName,
        address: req.body.companyAddress,
        email: req.body.companyEmail,
    });
    let newUser;

    Company.create(newCompany, function (err, newlyCreated) {
        if (err) {
            res.status(404),
                res.redirect('back');
        } else {
            var sel = req.body.userRole;
            newUser = new User({
                username: req.body.username,
                userEmail: req.body.userEmail,
                userRole: sel,
                companyName: req.body.companyName,
                companyEmail: req.body.companyEmail,
                companyAddress: req.body.companyAddress,
                company: {
                    id: newlyCreated._id
                }
            });

            User.register(newUser, req.body.password, function (err, user) {
                if (err) {
                    res.status(404);
                    return res.redirect('/register');
                }
                passport.authenticate('local')(req, res, function () {
                    if (user.userRole === 'Admin') {
                        res.status(200);
                        res.redirect('/homeadmin');
                    } else {
                        res.status(200);
                        res.redirect('/homeemployee');
                    }
                });
            })
        }
    });
});

//MOSTRA FORM DI LOGIN
router.get('/login', function (req, res) {
    res.render('frontpage/login.ejs');
});

//LOGIN DI UN UTENTE
router.post('/login', function (req, res) {
    User.findOne({ username: req.body.username }, function (err, user) {
        if (err) {
            res.status(404);
            res.redirect('/');
        } else {
            if (user != null && user.companyName === req.body.companyName) {
                if (user.userRole === 'Admin') {
                    passport.authenticate('local')(req, res, function () {
                        res.status(200);
                        res.redirect('/homeadmin');
                    });
                } else {
                    passport.authenticate('local')(req, res, function () {
                        res.status(200);
                        res.redirect('/homeemployee');
                    });
                }
            } else {
                res.redirect('/');
            }
        }
    });
});

//LOGOUT
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
})

module.exports = router;