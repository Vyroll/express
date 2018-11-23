const  mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    login:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    username:{
        type: String,
        require: true
    }
},{
    versionKey: false
});

let User = module.exports = mongoose.model('User', userSchema);