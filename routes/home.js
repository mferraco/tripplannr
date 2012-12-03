
/*
 * GET home page.
 */

exports.home = function(req, res){
  res.render('home', { title: 'Express' });
};

exports.desktop = function(req, res){
  res.render('desktop', { title: 'Express' });
};