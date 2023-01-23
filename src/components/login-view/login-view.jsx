// Imported React and its useState hook 
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// imported form and button from react bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import axios from 'axios';

import './login-view.scss';

export function LoginView(props) {
  // called useState() with empty string, the intial value of login variable
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  // returns an array of paired values, destructured above

  // declared a useState hook 
  const [ usernameErr, setUsernameErr ] = useState('');
  const [ passwordErr, setPasswordErr ] = useState('');

  // defined a function for validating user inputs
  const validate = () => {
    let isReq = true;
    if(!username){
      setUsernameErr('Username Required');
      isReq = false;
    }else if(username.length < 2){
      setUsernameErr('Username must be 2 characters long');
      isReq = false;
    } else if(password.length < 6){
      setPasswordErr('Password must be 6 characters long');
      isReq = false;
    }
    return isReq;
  }

  // preventing default event
  const handleSubmit = (e) => {
    e.preventDefault();
    const isReq = validate();
    if (isReq) {
      // send a request to the server for authentication
      axios.post('https://movie-api.fly.dev/login', {
        Username: username,
        Password: password,
      })
      .then((response) => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch(err => {
        console.log('no such user');
      });
    }
  };

  return (
    <Form>
      <Form.Group controlId="formUsername">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* code added here to display validation error */}
        {usernameErr && <p>{usernameErr}</p>}
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* code added here to display validation error */}
        {passwordErr && <p>{passwordErr}</p>}
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Login
      </Button>
    </Form>
  );
}

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired
};