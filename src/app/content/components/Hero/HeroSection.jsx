import React from 'react';

import './HeroSection.css';
import { Button } from 'antd';

import logo from '../../../../assets/logo.svg';

const HeroSection = () => (
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
    <Button type="primary" className="action-button">Get <span className="action-button-brand">tailRD</span></Button>
  </div>
);

export default HeroSection;