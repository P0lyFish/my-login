import React, { useState, useEffect } from 'react';
import Webcam from "react-webcam";
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import FormData from 'form-data'

import "./LoginPage.css"


export function LoginPage(props) {
  const history = useHistory();
  const [state, setState] = useState({
    username: '',
    password: '',
    showWebcam: false,
    modelLoaded: false,
    capturedImg: '',
  });
  const webcamRef = React.useRef(null);
  const imageRef = React.useRef(null);

  if (!state.modelLoaded) {
    setState({...state, modelLoaded: true});
    Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    ]).then(() => {
      console.log('Model loaded');
      setState({...state, modelLoaded: true});
    })
  }


  const handleChangePassButton = () => {
    const path = '/change-pass';
    console.log('change pass button pushed');
    history.push(path);
  }

  const handleLoginButton = () => {
    axios.get("/login", {
      params: {
        username: state.username,
        password: state.password
      }
    }).then(res => {
      console.log(res.data);
    }).catch(err => {
      throw err;
    }); 
  }

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n) {
      u8arr[n - 1] = bstr.charCodeAt(n - 1)
      n -= 1 // to make eslint happy
    }
    console.log(mime);
    return new File([u8arr], filename, { type: mime })
  }

  const loginUsingFace = (faceBase64Img) => {
    const file = dataURLtoFile(faceBase64Img);
    let data = new FormData();
    // data.append('face', file);
		data.append('faceImg', faceBase64Img);

		axios({
			method: "post",
			url: "/faceid",
			data: data,
			// headers: { "Content-Type": "multipart/form-data" },
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then(function (response) {
				//handle success
				console.log(response.data);
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});
  }

  const capture = () => {
    if (webcamRef.current !== null) {
      var capturedImg = webcamRef.current.getScreenshot();
      console.log(capturedImg.length);
      setState({...state, capturedImg: capturedImg});
      faceapi.detectSingleFace(imageRef.current).then(
        res => {
          if (res && res._score > 0.7) {
            console.log('Sending face to server');
            loginUsingFace(capturedImg);
          }
        }
      );
    }
  }

  const handleFaceLoginButton = () => {
    setState({...state, showWebcam: true});
  }


  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  };


  return (
    <div className="d-flex align-items-center" style={{minHeight: '100vh'}}>
      <Card id='loginCard'>
        <span id="loginTopBox"></span>

        <Card.Body>

          <Card.Title id='loginTitle'>Sign in</Card.Title>
          <Card.Text id='loginDesc'>
            Use your provided account to login
          </Card.Text>

          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={state.username}
                onChange={e => setState({...state, username: e.target.value})}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={state.password}
                onChange={e => setState({...state, password: e.target.value})}
              />
            </Form.Group>

            <div id="buttonGroup">
              <Button
                variant="primary"
                id='loginButton'
                size='lg'
                onClick={handleLoginButton}
              >Login</Button>

              <Button
                variant="outline-primary"
                id='changePassButton'
                size='lg'
                onClick={handleChangePassButton}
              >forgot your password?</Button>

              <Button
                variant="outline-primary"
                id='faceLoginButton'
                size='lg'
                onClick={handleFaceLoginButton}
              >Login using your face</Button>
              <Button
                variant="outline-primary"
                id='captureButton'
                size='lg'
                onClick={capture}
              >Capture</Button>
            </div>
          </Form>

        </Card.Body>

        <Card.Footer className="text-muted">
          Contact admin: <a href='v.phongtt15@vinai.io'>Send email</a>
        </Card.Footer>
      </Card>

      {state.showWebcam && <Webcam
        audio={false}
        ref={webcamRef}
        height={480}
        screenshotFormat="image/jpeg"
        width={640}
        videoConstraints={videoConstraints}
      />}

      {true && <img ref={imageRef} id="capturedImage" src={state.capturedImg}/>}
    </div>
  );
}
