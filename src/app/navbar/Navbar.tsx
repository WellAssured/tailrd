import * as React from 'react';
import { Row, Col } from 'antd';
import logo from '../../assets/logo.svg';

import './Navbar.css';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => (
  <Row type="flex" justify="space-between" className="navbar">
    <Col sm={4} md={8}>
      <div className="navbar-brand-container">
        <img src={logo} className="brand-image" alt="brand"/>
        <Link to="/"><span className="brand-name">tailRD</span></Link>
      </div>
    </Col>
    <Col sm={4} md={4}>
      <div className="link-container">
        <div className="nav-link-container">
          <NavLink to="/chat" activeClassName="active-nav-link" >Chat</NavLink>
        </div>
      </div>
    </Col>
  </Row>
);

export default Navbar;
