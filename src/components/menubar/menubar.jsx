import React from 'react';
import { Container, Form, Nav, Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './menubar.scss';


export function Menubar({ user }) {
  //Sign out method
  const onLoggedOut = () => {
    localStorage.clear();
    window.open('/', '_self');
  };
  // defined a method that returns a token from local storage
  const isAuth = () => {
    if (typeof window == 'undefined') {
      return false;
    }
    if (localStorage.getItem('token')) {
      return localStorage.getItem('token');
    } else {
      return false;
    }
  };

  return (
    <Navbar bg="light" variant="light" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Brand href="/">MyFlix Movie </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            {/* if user logs in user part will be shown in Menubar and will hide sign-up */}
            {isAuth() && <Link to={`/users/${user}`}>{user}</Link>}
            {isAuth() && (
              <Button
                variant="outline-danger"
                className='btn btn-outline-danger'
                onClick={() => {
                  onLoggedOut();
                }}
              >
                Logout
              </Button>
            )}
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          {!isAuth() && (
            <Button variant="outline-primary" href="/register" type="submit">
              Sign-up
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}