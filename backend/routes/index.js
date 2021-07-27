var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: req.session.key["username"] });
  console.log(req);
});

module.exports = router;
