import React, { Component } from 'react';
import Navbar from '../../navbar';
import ContentContainer from '../../vanity';
import './TailrdApp.css';

export default class TailrdApp extends Component {
  render() {
    return (
      <div className="tailRD-app">
        <Navbar />
        {/* React Router can go here - Vanity | Blog | Messaging App | Dashboard | etc. */}
        <ContentContainer />
      </div>
    );
  }
}
