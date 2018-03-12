import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Button, Icon } from 'antd';

import './Signup.css';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
  }

  renderHeader = () => (
    <div className="signup-modal-header">
      Why, hello there!
    </div>
  )

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // validate form here
    this.props.onSubmit(this.state);
  }

  render() {
    return (
      <Modal
        className="signup-modal"
        visible={this.props.visible}
        title={this.renderHeader()}
        onCancel={this.props.onClose}
        footer={null}
      >
        <div className="signup-modal-container">
          <div className="signup-modal-title">
            You're here a bit early.<br/>
            Leave your email and we'll let you know when it's ready for you.
          </div>
          <div className="signup-form-container">
            <Form
              layout="horizontal"
              onSubmit={this.handleSubmit}
            >
              <Form.Item
                label="Email"
                colon={false}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
              >
                <Input
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" 
                />
              </Form.Item>
              <div className="signup-form-submit">
                <Button
                  className="signup-form-submit-button"
                  type="submit"
                  onClick={this.handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    );
  }
}

Signup.propTypes = {
  visible: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};


export default Signup;
