const express = require('express');
const router = express.Router();
const  path = require('path');

let Article = require(path.join(__dirname, '/../models/article'))

/* GET news listing. */
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

/* GET news post. */
router.post('/add', function(req, res, next) {
    // console.log('[kg] submitted');
    let article = new Article();
    article.title = req.body.title;
    article.content = req.body.content;

    article.save((err)=>{
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect("/articles/");
        }
    })
});

module.exports = router;