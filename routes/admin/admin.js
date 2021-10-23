const express = require('express');
const router = express.Router();
const Department = require('../../models/department');
var middleware = require('../../middleware');

//ROUTE HOMEPAGE ADMIN
router.get('/homeadmin', middleware.isLoggedInAsAdmin, async (req, res) => {
    try {
        // trovare tutti i dipartimenti
        const allDepartments = await Department.find({});

        res.render('admin/index.ejs', { departments: allDepartments, currentUser: req.user });
    } catch (err) {
        res.status(404);
        return res.redirect('back');
    }
});

module.exports = router;
