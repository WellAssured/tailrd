import * as React from 'react';
import { Modal, Form, Input, Button, Icon } from 'antd';

import './Signup.css';

interface IProps {
  visible: boolean;
  isLoading: boolean;
  signupStatus: string;
  signupMessage: string;
  onSubmit: (form: Object) => void;
  onClose: () => void;
}

interface IState {
  firstName: string;
  lastName: string;
  email: string;
  attemptedSubmit: boolean;
  formFeedback: {
    firstName: {},
    lastName: {},
    email: {},
  };
}

class Signup extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      attemptedSubmit: false,
      formFeedback: {
        firstName: {},
        lastName: {},
        email: {},
      },
    };
  }

  validateForm = (inputName?: string) => {
    // validate form here
    let formValid = true;
    let formFeedback = this.state.formFeedback;
    // If inputName is defined, only validate the specified target
    if (!inputName || inputName === 'firstName') {
      if (!this.state.firstName) {
        formValid = false;
        formFeedback.firstName = {
          validateStatus: 'error',
          hasFeedback: true,
          help: 'We\'re going to need your first name...'
        };
      } else {
        formFeedback.firstName = {};
      }
    }
    if (!inputName || inputName === 'lastName') {
      if (!this.state.lastName) {
        formValid = false;
        formFeedback.lastName = {
          validateStatus: 'error',
          hasFeedback: true,
          help: 'We\'re also going to need your last name...'
        };
      } else {
        formFeedback.lastName = {};
      }
    }
    if (!inputName || inputName === 'email') {
      if (!this.state.email) {
        formValid = false;
        formFeedback.email = {
          validateStatus: 'error',
          hasFeedback: true,
          help: 'We\'re definitely going to need your email...'
        };
      } else if (!(/(.+)@(.+){2,}\.(.+){2,}/.test(this.state.email))) {
        formValid = false;
        formFeedback.email = this.state.attemptedSubmit ? {
          validateStatus: 'error',
          hasFeedback: true,
          help: 'This doesn\'t look like a valid email address.'
        } : {};
      } else {
        formFeedback.email = {};
      }
    }
    this.setState({ formFeedback });
    return formValid;
  }

  renderHeader = () => (
    <div className="signup-modal-header">
      {this.props.signupStatus === 'success' ? 'You\'re on the list!' : 'Why, hello there!'}
    </div>
  )

  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const inputName = e.currentTarget.name;
    this.setState({ [inputName as keyof IState]: e.currentTarget.value } as any, () => this.validateForm(inputName));
  }

  handleSubmit = () => {
    // e.preventDefault();
    this.setState({ attemptedSubmit: true });
    if (this.validateForm()) {
      this.props.onSubmit({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
      });
    }
  }

  renderSignupForm = () => (
    <div className="signup-modal-container">
      <div className="signup-modal-title">
        You're here a bit early.<br/>
        Leave your email and we'll let you know when it's ready for you.
       {this.props.signupStatus === 'error' && <div className="error-message">{this.props.signupMessage}</div>}
      </div>
      <div className="signup-form-container">
        <Form
          layout="horizontal"
          onSubmit={this.handleSubmit}
        >
          <Form.Item
            label="First Name"
            colon={false}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            {...this.state.formFeedback.firstName}
          >
            <Input
              name="firstName"
              value={this.state.firstName}
              onChange={this.handleChange}
              onPressEnter={this.handleSubmit}
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
              placeholder="What should we call you?"
              autoComplete="given-name"
            />
          </Form.Item>
          <Form.Item
            label="Last Name"
            colon={false}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            {...this.state.formFeedback.lastName}
          >
            <Input
              name="lastName"
              value={this.state.lastName}
              onChange={this.handleChange}
              onPressEnter={this.handleSubmit}
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="and what's your last name?"
              autoComplete="family-name"
            />
          </Form.Item>
          <Form.Item
            label="Email"
            colon={false}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            {...this.state.formFeedback.email}
          >
            <Input
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              onPressEnter={this.handleSubmit}
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Where can we reach you?"
              autoComplete="email"
            />
          </Form.Item>
          <div className="signup-form-submit">
            {this.props.isLoading ?
              <Button loading={true} className="signup-form-submit-button" />
              :
              <Button
                className="signup-form-submit-button"
                htmlType="submit"
                onClick={this.handleSubmit}
                /* autotrack DOM attributes */
                ga-on="click"
                ga-event-category="TOFU"
                ga-event-action="click"
                ga-event-label="Subscribe to Newsletter"
              >
                Submit
              </Button>
            }
          </div>
        </Form>
      </div>
    </div>
  )

  render() {
    return (
      <Modal
        className="signup-modal"
        visible={this.props.visible}
        title={this.renderHeader()}
        onCancel={this.props.onClose}
        footer={null}
      >
        {
          this.props.signupStatus === 'success' ?
          <div className="signup-modal-container">
            <div className="signup-success-text">{this.props.signupMessage}</div>
            <div className="signup-form-submit">
              <Button
                className="signup-form-submit-button"
                onClick={this.props.onClose}
              >
                Great!
              </Button>
            </div>
          </div>
          :
          this.renderSignupForm()
        }
      </Modal>
    );
  }
}

export default Signup;
