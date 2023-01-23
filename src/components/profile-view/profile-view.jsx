import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FavoriteMovies } from "./favorite-movies";
import { UserUpdate } from "./user-update";

export function ProfileView(props) {
  const { movies } = props;
  const [user, setUser] = useState('');
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const currentUser = props.user;
  const token = localStorage.getItem('token');

  const getUser = () => {
    axios
      .get(`https://movie-api.fly.dev/users/${currentUser.name}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
        setFavoriteMovies(response.data.FavoriteMovies);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleDelete = () => {
    axios
      .delete(`https://movie-api.fly.dev/users/${currentUser.name}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        alert('Profile has been deleted!');
        localStorage.clear();
        window.open('/register', '_self');
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Container>
      <Row>
        <h3>Your profile</h3>
      </Row>
      <Row>
        <Col className="label">Username:</Col>
        <Col className="value">{user.Username}</Col>
      </Row>
      <Row className="mt-3">
        <Col className="label">Password:</Col>
        <Col className="value">******</Col>
      </Row>
      <Row className="mt-3">
        <Col className="label">Email:</Col>
        <Col className="value">{user.Email}</Col>
      </Row>
      <Row className="mt-3">
        <Col className="label">Birthdate:</Col>
        <Col className="value">{user.Birthdate}</Col>
      </Row>
      <Row className="mt-5">
        <h4>Your favorite movies</h4>
      </Row>
      <Row className="mt-3">
        <FavoriteMovies
          movies={movies}
          favoriteMovies={favoriteMovies}
          currentUser={user.name}
          token={token}
          removeMovie={props.removeFavorites}
        />
      </Row>
      <UserUpdate user={user} />
      <Button className="d-block mt-5" variant="danger" onClick={handleDelete}>
        Delete profile
      </Button>
    </Container>
  );
}
