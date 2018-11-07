var express = require('express');
var router = express.Router();
let tmp = { news: [
    {title: "news1", body: "hello this is news one"},
    {title: "news2", body: "hello this is news two"},
    {title: "news3", body: "hello this is news three"}
]};


/* GET news listing. */
router.get('/', function(req, res, next) {
    res.render('news', tmp);
});

module.exports = router;