import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from '../../navbar';
import VanitySite from '../../vanity';
import Chat from '../../chat';
import './TailrdApp.css';

export default class TailrdApp extends React.Component {
  render() {
    return (
      <Router>
        {/* React Router can go here - Vanity | Blog | Messaging App | Dashboard | etc. */}
        <div className="tailRD-app">
          <Navbar />
          <Switch>
            <Route exact={true} path="/" component={VanitySite} />
            <Route path="/chat" component={Chat} />
            <Route component={VanitySite} />
          </Switch>
        </div>
      </Router>
    );
  }
}
