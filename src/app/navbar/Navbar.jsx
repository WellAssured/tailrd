import React from 'react';
import { Row, Col } from 'antd';
import logo from '../../assets/logo.svg';

import './Navbar.css';

const Navbar = () => (
  <Row type="flex" justify="start" className="navbar">
    <Col sm={4} md={8}>
      <div className="navbar-brand-container">
        <img src={logo} className="brand-image" alt="brand"/>
        <span className="brand-name">tailRD</span>
      </div>
    </Col>
  </Row>
);

export default Navbar;
