import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Login, Register } from '../../auth';
import Navbar from '../../navbar';
import VanitySite from '../../vanity';
import Chat from '../../chat';
import './TailrdApp.css';

interface IState {
  authenticated: boolean;
}

interface IProps {}

class TailrdApp extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      authenticated: false
    };
    Auth.currentAuthenticatedUser().then((user) =>
      this.setState({ authenticated: true })
    ).catch(() => { /* Not authenticated */});
  }
  onLogin() {
    this.setState({ authenticated: true });
  }
  logout() {
    Auth.signOut().then(() => this.setState({ authenticated: false }));
  }

  render() {
    return (
      <Router>
        {/* React Router can go here - Vanity | Blog | Messaging App | Dashboard | etc. */}
        <div className="tailRD-app">
          <Navbar isSignedIn={this.state.authenticated} onSignOut={() => this.logout()} />
          <Switch>
            <Route exact={true} path="/" render={() => <VanitySite authenticated={this.state.authenticated} />} />
            <Route
              path="/chat"
              render={p =>
                this.state.authenticated ? 
                <Chat /> :
                <Redirect
                  to={{
                    pathname: '/signin',
                    state: { from: p.location }
                  }}
                />
              }
            />
            <Route
              path="/signin"
              render={props => 
                this.state.authenticated ?
                <Redirect to="/chat" /> :
                <Login onLoginSuccess={() => this.onLogin()} {...props} />
              }
            />
            <Route
              path="/signup"
              render={props => 
                this.state.authenticated ?
                <Redirect to="/chat" /> :
                <Register inModal={false} {...props} />
              }
            />
            <Redirect to="/" />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default TailrdApp;
