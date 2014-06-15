/*
 ** User's and associated models
 */

var crypto = require('crypto');
var mongoose = require('lib/db');

Schema = mongoose.Schema;

/* ======= Schemas ======= */

/*User schema*/
var user = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String
    },
    login: {
        type: String,
        unique: true
    },
    hashedPassword: {
        type: String
    },
    salt: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    rang: {
        type: String
    }
});

/* ======= Methods ======= */

/*Virtuals*/
user.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = Math.round((new Date().valueOf() * Math.random())) + '';
        this.hashedPassword = this.encryptPassword(password)
    })
    .get(function () {
        return this._password;
    })

/*Methods*/
user.methods.auth = function (pass) {
    return this.hashedPassword === this.encryptPassword(pass);
}

user.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}


module.exports.User = mongoose.model('User', user);