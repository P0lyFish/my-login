const express = require('express');
const router = express.Router();

const { insertNewUser, getUser } = require('../services/login')
const spawn = require("child_process").spawn;

router.post('/', (req, res, next) => {
  res.send("recieved your requires!");

  const pythonProcess = spawn(
    'python3.8',
    ["./services/Silent-Face-Anti-Spoofing/test.py", req.body.faceImg]
  );
  pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
});

module.exports = router;
