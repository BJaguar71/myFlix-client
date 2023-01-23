import React from 'react';
import PropTypes from 'prop-types';
//imported react bootstrap component
import { Button, Card, CardGroup, Container, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './movie-card.scss';

export class MovieCard extends React.Component {
  render() {
    const { movie } = this.props;

    return (
      <Container fluid className="movieCardContainer">
        <Row>
          <Col>
            <CardGroup>
              <Card className="movieCard mt-3 mb-3">
                <Card.Img variant="top" src={movie.Image} crossOrigin="anonymous"/>
                <Card.Body>
                  <Card.Title>{movie.Title}</Card.Title>
                  <Card.Text className="text-truncate">
                    {movie.Summary}
                  </Card.Text>
                  <Link to={`/movies/${movie._id}`}>
                    <Button variant='outline-warning'>
                      Open
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

/* setting the static proptypes to an obj contains special values provided by proptypes */
MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Description: PropTypes.string
    }),
    Summary: PropTypes.string.isRequired,
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Bio: PropTypes.string.isRequired,
      Image: PropTypes.string.isRequired
    }),
    Actors: PropTypes.array.isRequired,
    Image: PropTypes.string.isRequired,
    Year: PropTypes.number.isRequired,
    Featured: PropTypes.bool
  }).isRequired,
  onMovieClick: PropTypes.func
};