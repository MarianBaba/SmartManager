var middlewareObj = {};

//middleware che verifica se un utente è loggato come admin
middlewareObj.isLoggedInAsAdmin = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.userRole === 'Admin') {
            return next();
        }
    }
    res.status(401);
    res.redirect('/login');
};

//middleware che verifica se un utente è loggato come dipendente
middlewareObj.isLoggedInAsEmployee = function (req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.userRole !== 'Admin') {
            return next();
        }
    }
    res.status(401);
    res.redirect('/login');
};

//middleware che verifica se un utente è loggato
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401);
    res.redirect('/login');
};

module.exports = middlewareObj;