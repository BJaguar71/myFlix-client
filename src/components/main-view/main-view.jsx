// Importing React to create the component
import React from 'react';
import axios from 'axios';
import { Row, Col, Container } from 'react-bootstrap';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import './main-view.scss';
import { Menubar } from '../menubar/menubar';
// importing RegistrationView
import { RegistrationView } from '../registration-view/registration-view';
// importing LoginView component
import { LoginView } from '../login-view/login-view';
// importing MovieCard component
import { MovieCard } from '../movie-card/movie-card';
// importing MovieView component
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { ProfileView } from '../profile-view/profile-view';
import { UserUpdate } from '../profile-view/user-update';
import { GenreView } from '../genre-view/genre-view';

// Making and exposing the MainView component in order to be usable in other files using the React.Component template
export class MainView extends React.Component {
  constructor() {
    super();
    // initial state is set to null
    this.state = {
      movies: [],
      user: "",
    };
  }
  // updated the method to persist the login data
  componentDidMount() {
    // first getting the value of the token from the local storage
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: JSON.parse(localStorage.getItem('User')),
      });
      // if the user is logged in then the getMovies method will be called (makes GET request to the movies endpoint)
      this.getMovies(accessToken);
    }
  }

  /* When a user successfully logs in, this function will store the user's token in local storage to hepl user stay logged in */
  onLoggedIn(authData) {
    const userObj = {
      name: authData.user.Username,
      userID: authData.user._id,
      favoriteMovies: authData.user.FavoriteMovies,
    };
    this.setState({
      user: userObj,
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('User', JSON.stringify(userObj));
    this.getMovies(authData.token);
  }

  // adding a new GetMovie method in order to be able to make authenticated requests to the API and see the list of movies
  getMovies(token) {
    axios
      .get('https://movie-api.fly.dev/movies', {
        // passing the bearer authorization in the header of the http request to make authenticated request to te API
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // assigning the result to the state
        this.setState({
          movies: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // add movie to fave list
  addMovie(movieId) {
    axios({
      method: 'post',
      url: `https://movie-api.fly.dev/users/${this.state.user.userID}/movies/${movieId}`,

      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((response) => {
        alert('The movie was successfully added.');
      })
      .catch((err) => console.log(err));
  }

  // delete movie from fav list
  deleteMovie(movieId) {
    axios({
      method: 'delete',
      url: `https://movie-api.fly.dev/users/${this.state.user.userID}/movies/${movieId}`,

      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((response) => {
        alert('The movie was successfully removed.');
      })
      .catch((err) => console.log(err));
  }

  // Rendering the visual representation of the component
  render() {
    const { movies, user } = this.state;

    return (
      <Router>
        {/* placed Menubar */}
        <Menubar user={user && user.name} />
        {/* Username will appear on main view after successful login
        <Link to={`/users/${user}`}>{user}</Link> */}
        <Container>
          <Row className="main-view justify-content-md-center mt-3">
            {/* Routing starts from here */}
            <Route
              exact
              path="/"
              render={() => {
                /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are *passed as a prop to the LoginView*/
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );
                // before the movies have been loaded
                if (movies.length === 0) return <div className="main-view" />;

                return movies.map((m) => (
                  <Col md={3} key={m._id}>
                    <MovieCard movie={m} />
                  </Col>
                ));
              }}
            />
            {/* creatinhg route for Menubar view */}
            <Route
              path="/register"
              render={() => {
                if (user) return <Redirect to="/" />;
                return (
                  <Col>
                    <RegistrationView />
                  </Col>
                );
              }}
            />
            <Route
              path="/movies/:movieId"
              render={({ match, history }) => {
                {
                  /* check if user has the auth to open the link */
                }
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                      ;
                    </Col>
                  );
                if (!movies) return <div className="main-view" />;
                return (
                  <Col md={8}>
                    <MovieView
                      movie={movies.find((m) => m._id === match.params.movieId)}
                      onBackClick={() => history.goBack()}
                      addMovie={(movieID) => this.addMovie(movieID)}
                      removeMovie={(movieID) => this.deleteMovie(movieID)}
                      user={user}
                    />
                  </Col>
                );
              }}
            />
            <Route
              path="/directors/:name"
              render={({ match, history }) => {
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );
                if (!movies) return <div className="main-view" />;
                return (
                  <Col md={8}>
                    <DirectorView
                      director={
                        movies.find(
                          (m) => m.Director.Name === match.params.name
                        ).Director
                      }
                      directedMovies={movies.filter(
                        (m) => m.Director.Name === match.params.name
                      )}
                      onBackClick={() => history.goBack()}
                    />
                  </Col>
                );
              }}
            />
            <Route
              path="/genres/:name"
              render={({ match, history }) => {
                if (!user)
                  return (
                    <Col>
                      <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                    </Col>
                  );
                if (!movies) return <div className="main-view" />;
                return (
                  <Col md={8}>
                    <GenreView
                      genre={
                        movies.find((m) => m.Genre.Name === match.params.name)
                          .Genre
                      }
                      genreMovies={movies.filter(
                        (m) => m.Genre.Name === match.params.name
                      )}
                      onBackClick={() => history.goBack()}
                    />
                  </Col>
                );
              }}
            />
            <Route
              path={`/users/:username`}
              render={({ match, history }) => {
                if (user.name != match.params.username)
                  return <Redirect to="/" />;
                return (
                  <Col>
                    <ProfileView
                      movies={movies}
                      user={user}
                      onBackClick={() => history.goBack()}
                      removeFavorites={(movieId) => this.deleteMovie(movieId)}
                    />
                  </Col>
                );
              }}
            />
          </Row>
        </Container>
      </Router>
    );
  }
}
