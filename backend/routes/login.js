const express = require('express');
const router = express.Router();

const { insertNewUser, getUser } = require('../services/login')

router.get('/', (req, res, next) => {
  const user = getUser(req.query.username, req.query.password, user => {
    console.log(user);
    res.send(user);
  })
});

module.exports = router;
