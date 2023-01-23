import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Row, Form, Button, Container, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './registration-view.scss';

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [values, setValues] = useState({
    // declaring hook for each input
    usernameErr: '',
    passwordErr: '',
    emailErr: ''
  });

  // validating user inputs
  const validate = () => {
    let isReq = true;
    if(!username){
      setValues({...values, usernameErr: 'Username Required'});
      isReq = false;
    }else if(username.length < 2){
      setValues({...values, usernameErr: 'Username must be 5 characters long'});
      isReq = false;
    }
    if (!password){
      setValues({...values, passwordErr: 'Password Required'});
      isReq = false;
    }else if (password.length < 6){
      setValues({...values, passwordErr: 'Password must be 6 characters long'});
      isReq = false;
    }
    if(!email){
      setValues({...values, emailErr: 'Email Required'
      });
      isReq = false;
    }else if(email.indexOf('@') === -1) {
      setValues({...values, emailErr: 'Email is invalid'
      });
      isReq = false;
    }else if(email.indexOf('.') === -1){
      setValues({...values, emailErr: 'Email is invalid'
      });
      isReq = false;
    }
    return isReq;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    //assigning variable isReq to validate function 
    const isReq = validate();
    if(isReq){
      axios.post('https://movie-api.fly.dev/users', {
        Username: username,
        Password: password,
        Email: email,
        Birthdate: birthdate
      })
      .then(response => {
        const data = response.data;
        console.log(data);
        alert('Registration successful, please login!');
        // the second argument '_self' is necessary so that the page will open in the current tab
        window.open('/', '_self'); 
      })
      .catch(response => {
        console.error(response);
        alert('unable to register');
      });
    }
    // /* Send a request to the server for authentication */
    // /* then call props on registored user(username) */
    // props.onRegistration(username);
  };

  //defined a click handler method then users can make post request to the user endpoint
  const handleRegistration = (e) => {
    e.preventDefault();
    axios.post('https://movie-api.fly.dev/users', {
      Username: username,
      Password: password,
      Email: email,
      Birthdate: birthdate      
    }).then(response => {
      const data = response.data;
      console.log(data);
      window.open('/', '_self');
    }).catch(e => {
      console.log('error registrating the user')
    });
  }
  
  return (
    <Container>
      <Row className='mt-5'>
        <Form>
          <h3>Sign Up</h3>
          <p></p>
          <Form.Group as={Col} controlId='formUsername'>
            <Form.Label>Username: </Form.Label>
            <Form.Control
              type='text'
              value={username}
              placeholder='Username'
              onChange={(e) => setUsername(e.target.value)}
            />
            {/* code added here to display validation error  */}
            {values.usernameErr && <p>{values.usernameErr}</p>}
          </Form.Group>

          <Form.Group as={Col} controlId='formPassword'>
            <Form.Label>Password: </Form.Label>
            <Form.Control
              type='password'
              value={password}
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* code added here to display validation error */}
            {values.passwordErr && <p>{values.passwordErr}</p>}
          </Form.Group>
          <Form.Group as={Col} controlId='formEmail'>
            <Form.Label>Email: </Form.Label>
            <Form.Control
              type='email'
              value={email}
              placeholder='Email'
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* code added here to display validation error */}
            {values.emailErr && <p>{values.emailErr}</p>}
          </Form.Group>

          <Form.Group as={Col} controlId='updateBirthdate'>
            <Form.Label>Birthdate: </Form.Label>
            <Form.Control
              type='date'
              value={birthdate}
              placeholder='Birthdate'
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </Form.Group>

          <Button
            variant='primary'
            type='submit'
            as={Col}
            onClick={handleSubmit}
          >
            Register
          </Button>
          <p></p>
          <p>Already registered
            <Link to={'/'}>Sign In</Link>
            here
          </p>
          <Button variant="link" type="submit" onClick={handleSubmit}>
            Forget password?
          </Button>
        </Form>
      </Row>
    </Container>
  );
}

RegistrationView.propTypes = {
 register: PropTypes.shape({
  Username: PropTypes.string.isRequired,
  Password: PropTypes.string.isRequired,
  Email: PropTypes.string.isRequired,
  Birthdate: PropTypes.string.isRequired
 }),
};
