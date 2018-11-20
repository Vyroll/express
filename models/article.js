const  mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    content:{
        type: String,
        require: true
    },
},{
    versionKey: false
});

let Article = module.exports = mongoose.model('Article', articleSchema);