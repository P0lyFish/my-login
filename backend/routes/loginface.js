const express = require('express');
const router = express.Router();

const { insertNewUser, getUser } = require('../services/login')

router.post('/', (req, res, next) => {
  res.send("recieved your requires!");
});

module.exports = router;
