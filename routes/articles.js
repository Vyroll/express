const express = require('express');
const path = require('path');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();
let Article = require(path.join(__dirname, '/../models/article'))

/* GET Index. */
router.get('/', function(req, res, next) {
    Article.find({}, (err, articles)=>{
        if (err) {
            console.log('[kg] ' + err)
        } else {
            res.render('articles/index', {
                articles
            });
        }
    })
});

/* GET news post. */
router.get('/add', function(req, res, next) {
    res.render('articles/add');
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
        .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
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
                content: req.body.content
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
router.get('/edit/:id', function(req, res, next) {
    req.flash("info", "added post");
    Article.findById(req.params.id, (err, article)=>{
        if (err) {
            console.log('[kg:GET Edit] ' + err)
        } else {
            res.render('articles/edit', {
                article
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

router.delete('/:id', function(req, res, next) {

    let query = {_id:req.params.id}

    Article.remove(query, (err)=>{
        if (err) {
            console.log('[kg] ' + err)
        } else {
            req.flash("inf", "artcile has been deleted");
            res.send('[kg] succes');
        }
    })
});


/* GET Show. */
// TODO: order matters because /:id i always matched 
router.get('/:id', function(req, res, next) {
    Article.findById(req.params.id, (err, article)=>{
        if (err) {
            console.log('[kg] ' + err)
        } else {
            res.render('articles/show', {
                article
            });
        }
    })
});

module.exports = router;