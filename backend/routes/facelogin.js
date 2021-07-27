const express = require('express');
const router = express.Router();

const { insertNewUser, getUser } = require('../services/login')
const spawn = require("child_process").spawn;

router.post('/', (req, res, next) => {
  const pythonProcess = spawn(
    'python3.8',
    ["./services/face_recognition/test.py", req.body.faceImg]
  );
  pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString())
    if (data.toString().trim() === 'null')
      res.send('Unknown face');
    else {
      const user = getUser(data.toString().trim(), null, user => {
      // console.log(user);
      req.session.key = user;
      res.send(user);
  })
    }
  });
});

module.exports = router;
