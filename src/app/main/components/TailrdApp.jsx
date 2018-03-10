import React, { Component } from 'react';
import Navbar from '../../navbar';
import ContentContainer from '../../content';
import './TailrdApp.css';

export default class TailrdApp extends Component {
  render() {
    return (
      <div className="tailRD-app">
        <Navbar />
        <ContentContainer />
      </div>
    );
  }
}
