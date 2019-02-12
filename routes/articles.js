const express = require('express');
const path = require('path');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();
let Article = require(path.join(__dirname, '/../models/article'))
let User = require(path.join(__dirname, '/../models/user'))

/* GET Index. */
router.get('/', function(req, res, next) {
    Article.find({}, (err, articles)=>{
        if (err) {
            console.log('[kg] ' + err)
        } else {
            res.render('articles/index', {
                articles,
                title: 'Artciles'
            });
        }
    })
});

/* GET news post. */
router.get('/add', logedIn, function(req, res, next) {
    res.render('articles/add',{
        title: 'Create Article'
    });
});

/* POST new */
router.post(
    '/add',
    [
        check('title')
        .not().isEmpty().withMessage('must be set')
        .isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
        check('content')
        .not().isEmpty().withMessage('must be set')
        .isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach((err) => {
                req.flash("err", `${err.param}: ${err.msg}`);
              });
            res.redirect("/articles/add");
        } else {
            Article.create({
                title: req.body.title,
                content: req.body.content,
                author: req.user._id
            }, (err, small) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    req.flash("inf", "artcile has been created");
                    res.redirect("/articles/");
                }
            }).then(article => res.json(article));
        }
});

/* GET Edit. */
router.get('/edit/:id', logedIn, function(req, res, next) {
    Article.findById(req.params.id, (err, article)=>{
        if (err) {
            console.log('[kg:GET Edit] ' + err)
        } else if(article.author !== req.user._id) {
            console.log("asd");
            req.flash("err", "u need to own this");
            res.redirect("/");
        } else {
            res.render('articles/edit', {
                article,
                title: 'Edit Article'
            });
        }
    })
});

// POST edit
router.post('/edit/:id', function(req, res, next) {
    let article = {};
    article.title = req.body.title;
    article.content = req.body.content;

    let query = {_id:req.params.id}

    Article.update(query,article,(err)=>{
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash("inf", "artcile has been eddited");
            res.redirect("/articles/");
        }
    })
});

// DELETE article
router.delete('/:id', function(req, res, next) {

    if(!req.user._id) {
        res.status(500).send();
    }
    let query = {_id:req.params.id}

    Article.findById(req.params.id, (err, article)=>{
        if(article.author !== req.user._id) {
            res.status(500).send();
        } else {
            Article.remove(query, (err)=>{
                if (err) {
                    console.log('[kg] ' + err)
                } else {
                    req.flash("inf", "artcile has been deleted");
                    res.send('[kg] succes');
                }
            })
        }
    })
});


/* GET Show. */
// TODO: order matters because /:id i always matched 
router.get('/:id', function(req, res, next) {
    Article.findById(req.params.id, (err, article)=>{
        User.findById(article.author,(err, user)=>{
            if (err) {
                console.log('[kg] ' + err)
            } else {
                res.render('articles/show', {
                    article,
                    author:user.username,
                    title: 'Article'
                });
            }
        })
    })
});

function logedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('err', 'U need to be loged in');
        res.redirect('/users/login')
    }
}
module.exports = router;