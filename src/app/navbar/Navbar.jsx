import React from 'react';
import { Row, Col } from 'antd';
import logo from '../../assets/logo.svg';

import './Navbar.css';

const Navbar = () => (
  <Row type="flex" justify="start" className="navbar">
    <Col span={8}>
      <div className="navbar-brand-container">
        <img src={logo} className="brand-image" alt="brand"/>
        <span className="brand-name">tailRD</span>
      </div>
    </Col>
    <Col span={16} />
  </Row>
);

export default Navbar;
