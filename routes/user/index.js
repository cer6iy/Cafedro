
/*
 * GET home page (authorized).
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

/*
 * GET home page (unauthorized).
 */

exports.login = function(req, res){
    res.render('login');
};