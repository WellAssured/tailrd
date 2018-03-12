import React from 'react';
import PropTypes from 'prop-types';

import './HeroSection.css';
import { Button } from 'antd';

import logo from '../../../../assets/logo.svg';

const HeroSection = (props) => (
  <div className="hero-section content-section">
    <div className="hero-title">
      <h2>Personal Health</h2>
      <img src={logo} className="logo-icon" alt="logo"/>
      <h2>Made to Measure</h2>
    </div>
    <p>
      Connect with a
      <span className="words-rd"> Registered Dietitian </span>
      and start<br/>getting expert advice to achieve your health goals
    </p>
    <Button
      type="primary"
      className="action-button"
      onClick={props.onSignupClick}
    >
      Get <span className="action-button-brand">tailRD</span>
    </Button>
  </div>
);

HeroSection.propTypes = {
  onSignupClick: PropTypes.func.isRequired,
};

export default HeroSection;