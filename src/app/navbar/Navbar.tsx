import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import logo from '../../assets/logo.svg';

import './Navbar.css';

interface INavProps extends RouteComponentProps<{}> {
  isSignedIn: boolean;
  onSignOut: () => void;
}

const Navbar = (props: INavProps) => (
  <Row type="flex" justify="space-between" className="navbar">
    <Col sm={4} md={8}>
      <div className="navbar-brand-container">
        <img src={logo} className="brand-image" alt="brand"/>
        <Link to="/"><span className="brand-name">tailRD</span></Link>
      </div>
    </Col>
    <Col sm={4} md={6} className="nav-link-container-container">
      <div className="nav-link-container">
        {props.isSignedIn ?
          <Button
            className="logout-button"
            shape="circle"
            icon="logout"
            title="Sign Out"
            ghost={true}
            onClick={() => {
              props.history.push('/');
              props.onSignOut();
            }}
          /> :  
          <NavLink to="/signin" className="navbar-link" activeClassName="active-nav-link">Sign In</NavLink>
        }
        { /*
        <NavLink to="/signup" className="navbar-link navbar-link-action" activeClassName="active-nav-link">Sign Up</NavLink>
        */ }
      </div>
    </Col>
  </Row>
);

export default withRouter(Navbar);
