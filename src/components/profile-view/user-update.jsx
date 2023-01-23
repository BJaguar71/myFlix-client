import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import './profile-view.scss';

export function UserUpdate(props) {
  const { user } = props;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [values, setValues] = useState({
    // declaring hook for each input
    usernameErr: '',
    passwordErr: '',
    emailErr: '',
    birthdateErr: '',
  });

  // validate user inouts
  const validate = () => {
    let isReq = true;
    if (!username) {
      setValues({ ...values, usernameErr: 'Username Required!' });
      isReq = false;
    } else if (username.length < 2) {
      setValues({
        ...values,
        usernameErr: 'Username must be 5 charachter long!',
      });
      isReq = false;
    }
    if (!password) {
      setValues({ ...values, passwordErr: 'Password Requires!' });
      isReq = false;
    } else if (password.length < 6) {
      setValues({
        ...values,
        passwordErr: 'Password must be at least 6 character long!',
      });
      isReq = false;
    }
    if (!email) {
      setValues({ ...values, emailErr: 'Email Required!' });
      isReq = false;
    } else if (email.indexOf('@') === -1) {
      setValues({ ...values, emailErr: 'Email is invalid!' });
      isReq = false;
    } else if (email.indexOf('.') === -1) {
      setValues({ ...values, emailErr: 'Email is invalid!' });
      isReq = false;
    }
  };

  // handleSubmit
  const handleSubmit = (event) => {
    event.preventDefault();
    const isReq = validate();
    if (isReq) {
      const token = localStorage.getItem('token');
      // axios patch method to update user
      axios
        .put(
          `https://movie-api.fly.dev/users/${user.Username}`,
          {
            Username: username,
            Password: password,
            Email: email,
            Birthdate: birthdate,
          },
          {
            headers: { Authorization: `Beare ${token}` },
          }
        )
        .then((respone) => {
          console.log(respone.data);
          alert('Profile was successfully updated!');
          window.open('/users/:username', '_self');
        })
        .catch((error) => {
          console.log(error);
          alert('Unable to update profile.');
        });
    }
  };

  return (
    <Container className="justify-content-center">
      <Form className="profile-form" onSubmit={(e) => handleSubmit(e)}>
        <h2>Want to change some info?</h2>
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Username"
          defaultValue={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {values.usernameErr && <p>{values.usernameErr}</p>}

        <Form.Label>Password</Form.Label>
        <Form.Control
          type="text"
          placeholder="Password"
          defaultValue={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {values.passwordErr && <p>{values.passwordErr}</p>}

        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Email"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {values.emailErr && <p>{values.emailErr}</p>}

        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
    </Container>
  );
}