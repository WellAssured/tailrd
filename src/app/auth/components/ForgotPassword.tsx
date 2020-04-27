import * as React from 'react';
import { Button, Form, Input, Icon, Card } from 'antd';
import { Auth } from 'aws-amplify';

import '../Auth.css';
import { Redirect } from 'react-router';

interface IForgotProps {
  onLoginSuccess: () => void;
}
interface IForgotState {
  loggedIn: boolean;
  resetSuccess: boolean;
  needsToConfirm: boolean;
  isLoading: boolean;
  username: string;
  password: string;
  confirmationCode: string;
  formFeedback: {
    username: {},
    password: {},
    confirmationCode: {},
  };
  formError: {
    hasError: boolean;
    message: string;
  };
}

const forgotFormFields = [
  {
    'key': 'field-1', 'name': 'username', 'label': 'Username', 'icon': 'user',
    'type': 'text', 'placeholder': 'Jane Doe', 'autoComplete': 'name',
    'validate': (val: string) => {
      if (val.length === 0) {
        return { error: true, help: `We\'re going to need your Username...`};
      }
      return { error: false };
    }
  }
];

const confirmationFormFields = [
  {
    'key': 'field-1', 'name': 'password', 'label': 'Password', 'icon': 'lock',
    'type': 'password', 'placeholder': 'Keep this safe', 'autoComplete': '',
    'validate': (val: string) => {
      const minLength = 6;
      if (val.length < minLength) {
        return { error: true, help: 'Your new password needs to be at least 6 characters'};
      }
      return { error: false };
    }
  },
  {
    'key': 'field-2', 'name': 'confirmationCode', 'label': 'Code', 'icon': 'key',
    'type': 'text', 'placeholder': '6-digit Confirmation Code', 'autoComplete': '',
    'validate': (val: string) => {
      const length = 6;
      if (val.length !== length) {
        return { error: true, help: `Your Code should be ${length} digits`};
      }
      return { error: false };
    }
  }
];

class ForgotPassword extends React.Component<IForgotProps, IForgotState> {
  constructor(props: IForgotProps) {
    super(props);
    this.state = {
      loggedIn: false,
      resetSuccess: false,
      needsToConfirm: false,
      isLoading: false,
      username: '',
      password: '',
      confirmationCode: '',
      formFeedback: {
        username: {},
        password: {},
        confirmationCode: {},
      },
      formError: {
        hasError: false,
        message: ''
      }
    };
  }

  validateForm = (fieldName?: string, formName: ('Forgot' | 'Confirmation') = 'Forgot') => {
    // validate form here
    let formValid = true;
    let formFeedback = this.state.formFeedback;
    // if formName is defined, use those fields. (defaults to Register)
    const formFields = formName === 'Forgot' ? forgotFormFields : confirmationFormFields;
    // If inputName is defined, only validate the specified target
    const fieldsToValidate = fieldName ? formFields.filter(field => field.name === fieldName) : formFields;
    fieldsToValidate.forEach(field => {
      const validation = field.validate(this.state[field.name]);
      if (validation.error) {
        formValid = false;
        formFeedback[field.name] = {
          validateStatus: 'error',
          hasFeedback: true,
          help: validation.help
        };
      } else {
        formFeedback[field.name] = {};
      }
    });
    this.setState({ formFeedback });
    return formValid;
  }
  handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const inputName = e.currentTarget.name;
    this.setState({ [inputName as keyof IForgotState]: e.currentTarget.value } as any, () => this.validateForm(inputName));
  }
  handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (this.validateForm()) {
      this.setState({ isLoading: true });
      Auth.forgotPassword(this.state.username)
        .then(() => this.setState({ isLoading: false, needsToConfirm: true }))
        .catch(err => this.setState({ isLoading: false, formError: { hasError: true, message: err.message } }));
    }
  }

  handleConfirm = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (this.state.isLoading) { return; }
    if (this.validateForm(undefined, 'Confirmation')) {
      this.setState({ isLoading: true }, () =>
        Auth.forgotPasswordSubmit(this.state.username, this.state.confirmationCode, this.state.password)
        .then(() => this.setState({ needsToConfirm: false, isLoading: false, resetSuccess: true }))
        .catch((err: any) => {
          let message = '';
          if (err.message === undefined) {
            message = err;
          } else {
            switch (err.name) {
            case 'CodeMismatchException':
              message = 'Code does not match. Please try again.';
              break;
            case 'ExpiredCodeException':
              message = 'Invalid Confirmation Code. Please request another code and try again.';
              break;
            case 'InvalidParameterException':
              message = 'The password you entered is invalid. Please try again.';
              break;
            default:
              message = 'Something went wrong. Please try again.';
            }
          }
          this.setState({ isLoading: false, formError: { hasError: true, message } });
        })
      );
    }
  }

  login = () => {
    Auth.signIn(this.state.username, this.state.password).then(() =>
      this.setState({ loggedIn: true, isLoading: false }, () => this.props.onLoginSuccess())
    );
  }

  renderHeader = () => {
    let headerText = 'Forgot Password';
    if (this.state.resetSuccess) {
      headerText = 'Password Reset Successful!';
    } else if (this.state.needsToConfirm) {
      headerText = 'Set New Password';
    }

    return (
      <div className="auth-form-header">
        <div className="form-greeting">{headerText}</div>
        {
          this.state.needsToConfirm ? 
            <button
              className="link-button-text form-nav-link"
              onClick={() => this.setState({ needsToConfirm: false })}
            >
              Send another Code
            </button>
            : ''
        }
      </div>
    );
  }

  renderConfirmationForm = () => (
    <div className="auth-form">
      <div className="signup-modal-title">
        We just sent you a <span style={{ color: '#A78F5C' }}>Confirmation Code</span> (may take a couple minutes). <br/>
        Check your email and enter the <span style={{ color: '#A78F5C' }}>Code</span> with your <span style={{ color: '#A78F5C' }}>New Password</span> here.
      </div>
      <div className="form-error-message">{this.state.formError.hasError ? this.state.formError.message : <br/>}</div>
      <Form layout="horizontal" onSubmit={this.handleConfirm}>
        {confirmationFormFields.map(field => (
          <Form.Item
            key={field.key}
            label={field.label}
            colon={false}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            {...this.state.formFeedback[field.name]}
          >
            <Input
              type={field.type}
              name={field.name}
              value={this.state[field.name]}
              onChange={this.handleChange}
              onPressEnter={this.handleConfirm}
              prefix={<Icon type={field.icon} style={{ color: 'rgba(0,0,0,.25)' }} />} 
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
            />
          </Form.Item>
        ))}
        <div className="form-submit">
          {this.state.isLoading ?
            <Button className="submit-button" loading={true} /> :
            <Button className="submit-button" htmlType="submit">Set</Button>
          }
        </div>
      </Form>
    </div>
  )

  renderForgotForm = () => (
    <div className="auth-form">
      {this.state.formError.hasError && <div className="form-error-message">{this.state.formError.message}</div>}
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        {forgotFormFields.map(field => (
          <Form.Item
            key={field.key}
            label={field.label}
            colon={false}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            {...this.state.formFeedback[field.name]}
          >
            <Input
              type={field.type}
              name={field.name}
              value={this.state[field.name]}
              onChange={this.handleChange}
              onPressEnter={this.handleSubmit}
              prefix={<Icon type={field.icon} style={{ color: 'rgba(0,0,0,.25)' }} />} 
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
            />
          </Form.Item>
        ))}
        <div className="form-submit">
          {this.state.isLoading ?
            <Button className="submit-button" loading={true} /> :
            <Button className="submit-button" htmlType="submit">Send</Button>
          }
          <div className="form-submit-link">
            We'll send you a verification code so you can set a new password
          </div>
        </div>
      </Form>
    </div>
  )

  renderSuccessDialog = () => (
    <div className="auth-form">
      <div className="form-submit">
          {this.state.isLoading ?
            <Button className="submit-button" loading={true} /> :
            <Button className="submit-button" onClick={this.login}>Sign In</Button>
          }
        </div>
    </div>
  )

  renderForgotCardContents = () => {
    if (this.state.resetSuccess) {
      return this.renderSuccessDialog();
    }
    if (this.state.needsToConfirm) {
      return this.renderConfirmationForm();
    }
    return this.renderForgotForm();
  }

  render() {
    return (
        this.state.loggedIn ?
        <Redirect to="chat" /> :
        (
          <div className="auth-container">
            <Card className="auth-card login-card" title={this.renderHeader()} bordered={false}>
              {this.renderForgotCardContents()}
            </Card>
          </div>
        )
    );
  }
}

export default ForgotPassword;
