const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');

const { check, validationResult } = require('express-validator/check');

const router = express.Router();
let User = require(path.join(__dirname, '/../models/user'))

/* GET registraiton form */
router.get('/register', function(req, res, next) {
    res.render('users/register', {title:"Register"});
});

/* POST register user */
router.post(
    '/register',
    [
        check('login')
            .not().isEmpty().withMessage('must be set'),
        check('username')
            .not().isEmpty().withMessage('must be set'),
        check('email')
            .not().isEmpty().withMessage('must be set')
            .isEmail().withMessage('must be email'),
        check('password')
            .not().isEmpty().withMessage('must be set'),
        check('password2')
            .not().isEmpty().withMessage('must be set')
            .custom((value,{req, loc, path})=>{
                if (value !== req.body.password) {
                    throw new Error("Passwords don't match");
                } else {
                    return value;
                }
            })
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((err) => {
                req.flash("err", `${err.param}: ${err.msg}`);
              });
            res.redirect("/users/register");
        } else {
            let hash = bcrypt.hashSync(req.body.password, 10);
            User.create({
                login:req.body.login,
                password:hash,
                email:req.body.email,
                username:req.body.username
            }, (err, small) => {
                if (err) {
                    req.flash("err", err.errmsg);
                    res.redirect("/users/register");
                } else {
                    req.flash("inf", "User has been created");
                    res.redirect("/");
                }
            });
        }
});

module.exports = router;