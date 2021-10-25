const express = require('express');
const router = express.Router();
const Employee = require('../../models/employee');
var middleware = require('../../middleware');

//INDEX - HOME PAGE DEL DIPENDENTE
router.get('/homeemployee', middleware.isLoggedInAsEmployee, async (req, res) => {
    try {
        const foundEmployee = await Employee.findById(req.user.employee.id);

        res.render('employee/index.ejs', {
            employee: foundEmployee,
            currentUser: req.user
        });
    } catch (err) {
        res.status(404);
        return res.redirect('back');
    }
});

module.exports = router;