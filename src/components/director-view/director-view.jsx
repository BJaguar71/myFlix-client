import React from 'react';
import { Card, Col, Container, Row, Button } from 'react-bootstrap';

import { MovieCard} from '../movie-card/movie-card';


export function DirectorView(props) {
  const { director, directedMovies, onBackClick: goBack } = props;

  return (
    <Container>
      <Button variant="outline-dark" onClick={goBack}>
        Back
      </Button>
        <h1>{director.Name}</h1>
        <img className="director-img" src={director.Image} crossOrigin="anonymous"/>
          <h2>Bio:</h2>
          <p>{director.Bio}</p>
          <h3>Directed Movies:</h3>
          <Row className="justify-content-center">
            {directedMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie}>
                {movie.Title}
              </MovieCard>
            ))}
          </Row>
    </Container>
  );
}