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
// importing MovieView component
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { ProfileView } from '../profile-view/profile-view';
import { UserUpdate } from '../profile-view/user-update';
import { GenreView } from '../genre-view/genre-view';

// connect func help us to connect any component within the application to the store
import { connect } from 'react-redux';

// importing relevant action, here is setMovies and will be used in render() to connect to MainView using connect()
import { getMovies } from '../../actions/actions';

import MoviesList from '../movies-list/movies-list';


// Making and exposing the MainView component in order to be usable in other files using the React.Component template
export class MainView extends React.Component {
  constructor() {
    super();
    // initial state is set to null
    this.state = {
      movies: [],
      user: null,
    };
  }
  // updated the method to persist the login data
  componentDidMount() {
    // first getting the value of the token from the local storage
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user'),
      });
      // if the user is logged in then the getMovies method will be called (makes GET request to the movies endpoint)
      this.getMovies(accessToken);
    }
  }

  /* When a user successfully logs in, this function will store the user's token in local storage to hepl user stay logged in */
  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username,
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  // adding a new GetMovie method in order to be able to make authenticated requests to the API and see the list of movies
  getMovies(token) {
    axios
      .get('https://t-flix.fly.dev/movies', {
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
  // Rendering the visual representation of the component
  render() {
    const { movies } = this.props;
    const { user } = this.state;

    return (
      <Router>
        {/* placed Menubar */}
        <Menubar user={user} />
        <Container>
          <Row className="main-view justify-content-md-center">
            {/* Routing starts from here */}
            <Route
              exact
              path="/"
              render={() => {
                /* If there is no user, the LoginView is rendered. If there is a user logged in, the user details are *passed as a prop to the LoginView*/
                if (!user)
                  return (
                    <Row>
                      <Col>
                        <LoginView
                          onLoggedIn={(user) => this.onLoggedIn(user)}
                        />
                      </Col>
                    </Row>
                  );
                // before the movies have been loaded
                if (movies.length === 0) return <div className="main-view" />;
                // MoviesList receives the movies from the store in stages
              return <MoviesList movies={movies} />;
              }}
            />
            {/* creatinhg route for Menubar view */}
            <Route
              path="/register"
              render={() => {
                if (user) return <Redirect to="/" />;
                return (
                  <Col lg={8} md={8}>
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
                    <Col md={8}>
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
                if (user != match.params.username) return <Redirect to="/" />;
                return (
                  <Col>
                    <ProfileView
                      movies={movies}
                      user={user}
                      onBackClick={() => history.goBack()}
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
// any time the store is updated, this func mapStateToPtops will be called.
// mapStateToProps gets the state from the store and passes it as props to the component that is connected to the store. instead  of the component accessing the state directly, it accesses the sate as props, passed to it by the store
let mapStateToProps = state => {
  // movies is going to be the prop and whatever is in the stat.movies is passed to the prop
  return { movies: state.movies }
}

export default connect(mapStateToProps, { getMovies })(MainView);
//