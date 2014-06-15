var User = require('models/user').User,
    log = require('lib/log')(module);

/*
 ** Sign in/out & sign up or restore user password.
 */

var signIn = function (req, res) {
    var login = req.body.username,
        pass = req.body.password;

    User.findOne({mail: login}, function (err, user) {

        /*TODO: e-mail validation*/

        if (login && pass) {
            if (user && user.auth(pass)) {
                req.session.user_id = user.id;
                res.end('1');
            } else {
                res.end('0');

            }
        } else {
            res.end('0');
        }
    });

}

var signOutPost = function (req, res) {
    if (req.session) {
        req.session.destroy(function () {
        });
    }
    res.end("1");
}

var signOutGet = function (req, res) {
    if (req.session) {
        req.session.destroy(function () {
        });
    }
    res.redirect('/login');
}

var signUp = function (req, res) {
    var mail = req.body.mail;

    /*TODO: e-mail validation*/

    User.findOne({mail: mail}, function (err, u) {
        if (!err && !u) {
            var regToken = new RegToken({
                mail: mail
            });

            regToken.save(function (err, t, affected) {

                if (!err) {
                    /*TODO: by admin only sign up*/
                    res.end(t.token);
                } else {
                    res.end("0");
                }
            })
        } else {
            res.end("0");
        }
    })


}


var createUser = function (req, res) {

    /*TODO: fields validation*/

    var firstName = req.body.firstName,
        lastName = req.body.lastName,
        rang = req.body.rang,
        login = req.body.login,
        pass = req.body.password;

    log.info("Creating started..");

    User.findOne({login: login}, function (err, u) {
        if (!err && !u) {
            RegToken.remove({token: currentToken}, function () {
                log.info("Token deleting..");
                var newUser = new User({
                    name: firstName,
                    surname: lastName,
                    password: pass,
                    login: login,
                    rang: rang
                });

                newUser.save(function (err, u, affected) {
                    if (!err && u) {
                        res.end("1");
                    } else {
                        res.end("0");
                    }
                })
            });
        } else {
            log.error("User is alredy registered..");
            res.end("0");
        }
    })

}

/*
 ** check user
 */
function loadUser(id, next) {
    if (id) {
        User.findById(id, function (err, user) {
            if (!err && user) {
                var userData = {
                    firstName: user.name,
                    lastName: user.surname
                };
                next(userData);
            } else {
                next(null);
            }
        });
    } else {
        next(null);
    }
}

var passportLogin = function (req, res) {
    var redirectTo = req.session.returnTo ? req.session.returnTo : '/user'
    delete req.session.returnTo
    res.redirect(redirectTo)
}
var restorePasswordRender;
/*TODO: it*/

/*Local custom strategy*/
module.exports.SignIn = signIn;
module.exports.SignOutPost = signOutPost;
module.exports.SignOutGet = signOutGet;
module.exports.SignUp = signUp;
module.exports.CreateUser = createUser;
module.exports.LoadUser = loadUser;

