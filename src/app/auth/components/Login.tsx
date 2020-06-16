import * as React from 'react';
import { Button, Form, Input, Icon, Card } from 'antd';
import { Auth } from 'aws-amplify';
import { Redirect } from 'react-router';
import { NavLink } from 'react-router-dom';

import '../Auth.css';

interface ILoginProps {
  onLoginSuccess: () => void;
}
interface ILoginState {
  needsToConfirm: boolean;
  isLoading: boolean;
  loggedIn: boolean;
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

const loginFormFields = [
  {
    'key': 'field-1', 'name': 'username', 'label': 'Username', 'icon': 'user',
    'type': 'text', 'placeholder': 'Jane Doe', 'autoComplete': 'name',
    'validate': (val: string) => {
      if (val.length === 0) {
        return { error: true, help: `We\'re going to need your Username...`};
      }
      return { error: false };
    }
  },
  {
    'key': 'field-2', 'name': 'password', 'label': 'Password', 'icon': 'lock',
    'type': 'password', 'placeholder': 'Keep this safe', 'autoComplete': '',
    'validate': (val: string) => {
      if (val.length === 0) {
        return { error: true, help: 'We\'ll need your Password so we know it\'s you.'};
      }
      return { error: false };
    }
  }
];
const confirmationFormFields = [
  {
    'key': 'field-1', 'name': 'username', 'label': 'Username', 'icon': 'user',
    'type': 'text', 'placeholder': 'Jane', 'autoComplete': 'given-name',
    'validate': (val: string) => {
      const minLength = 2;
      if (val.length < minLength) {
        return { error: true, help: `Sorry, your Name must be longer than ${minLength} characters`};
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

class Login extends React.Component<ILoginProps, ILoginState> {
  constructor(props: ILoginProps) {
    super(props);
    this.state = {
      needsToConfirm: false,
      isLoading: false,
      loggedIn: false,
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

  validateForm = (fieldName?: string, formName: ('Login' | 'Confirmation') = 'Login') => {
    // validate form here
    let formValid = true;
    let formFeedback = this.state.formFeedback;
    // if formName is defined, use those fields. (defaults to Register)
    const formFields = formName === 'Login' ? loginFormFields : confirmationFormFields;
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
    this.setState({ [inputName as keyof ILoginState]: e.currentTarget.value } as any, () => this.validateForm(inputName));
  }
  handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (this.validateForm()) {
      this.setState({ isLoading: true });
      Auth.signIn(this.state.username, this.state.password)
        .then(() => {
          this.setState({ loggedIn: true, isLoading: false }, () => this.props.onLoginSuccess());
        })
        .catch((err: any) => {
          if (err.code === 'UserNotConfirmedException') {
            Auth.resendSignUp(this.state.username);
            this.setState({ isLoading: false, needsToConfirm: true });
          } else {
            this.setState({ isLoading: false, formError: { hasError: true, message: err.message } });
          }
        });
    }
  }
  handleConfirm = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (this.state.isLoading) { return; }
    if (this.validateForm(undefined, 'Confirmation')) {
      this.setState({ isLoading: true }, () => {
        Auth.confirmSignUp(this.state.username, this.state.confirmationCode)
        .then(data => {
          console.log(data);
          this.setState({ needsToConfirm: false, isLoading: false });
        })
        .catch((err: any) => {
          console.log(err);
          this.setState({ isLoading: false });
        });
      });
    }
  }

  renderHeader = () => (
    <div className="auth-form-header">
      <div className="form-greeting">Welcome back!</div>
      <NavLink to="/signup" className="form-nav-link">Need to Sign Up?</NavLink>
    </div>
  )

  renderConfirmationForm = () => (
    <div className="auth-form">
    <div className="signup-modal-title">
      Looks like you still need to <span style={{ color: '#A78F5C' }}>confirm your email address.</span><br/>
      We just resent you a <span style={{ color: '#A78F5C' }}>Confirmation Code</span> (may take a couple minutes). <br/>
      Check your email and enter the <span style={{ color: '#A78F5C' }}>Code</span> here.
      <div className="form-error-message">{this.state.formError.hasError ? this.state.formError.message : <br/>}</div>
    </div>
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
            <Button className="submit-button" htmlType="submit">Confirm</Button>
          }
        </div>
      </Form>
    </div>
  )

  renderLoginForm = () => (
    <div className="auth-form">
      {this.state.formError.hasError && <div className="form-error-message">{this.state.formError.message}</div>}
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        {loginFormFields.map(field => (
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
            <Button className="submit-button" htmlType="submit">Sign In</Button>
          }
          <div className="form-submit-link">
            <NavLink to="/forgot" className="form-nav-link">Forgot your password?</NavLink>
          </div>
        </div>
      </Form>
    </div>
  )

  render() {
    return (
      this.state.loggedIn ?
        <Redirect to="chat" /> :
        (
          <div className="auth-container">
            <Card className="auth-card login-card" title={this.renderHeader()} bordered={false}>
              {this.state.needsToConfirm ? this.renderConfirmationForm() : this.renderLoginForm()}
            </Card>
          </div>
        )
    );
  }
}

export default Login;
