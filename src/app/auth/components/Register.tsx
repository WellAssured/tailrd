import * as React from 'react';
import { Modal, Button, Form, Input, Icon, Card } from 'antd';
import { Auth } from 'aws-amplify';
import { NavLink, Redirect } from 'react-router-dom';
import { Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import StripeCheckoutForm from './StripeCheckoutForm';

import '../Auth.css';

interface IRegisterProps {
  inModal: boolean;
  visible?: boolean;
  stripe: Promise<Stripe | null>;
  onClose?: () => void;
  onRegisterSuccess: () => void;
}
interface IRegisterState {
  registered: boolean;
  confirmed: boolean;
  promo: string;
  paid: boolean;
  isLoading: boolean;
  attemptedSubmit: boolean;
  username: string;
  password: string;
  email: string;
  phone: string;
  zip: string;
  confirmationCode: string;
  formFeedback: {
    username: {},
    password: {},
    email: {},
    phone: {},
    zip: {},
    confirmationCode: {},
  };
  formError: {
    hasError: boolean;
    message: string;
  };
}

const registerFormFields = [
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
    'key': 'field-2', 'name': 'password', 'label': 'Password', 'icon': 'lock',
    'type': 'password', 'placeholder': 'Keep this safe', 'autoComplete': '',
    'validate': (val: string) => {
      const minLength = 8;
      if (val.length < minLength) {
        return { error: true, help: `Your Password must be longer than ${minLength} characters`};
      }
      return { error: false };
    }
  },
  {
    'key': 'field-3', 'name': 'phone', 'label': 'Phone', 'icon': 'phone',
    'type': 'text', 'placeholder': '+1 (336)-123-4567', 'autoComplete': 'tel',
    'validate': (val: string) => {
      const length = 10;
      if (val.length !== length) {
        return { error: true, help: `Your Phone Number must be ${length} characters`};
      }
      return { error: false };
    }
  },
  {
    'key': 'field-4', 'name': 'email', 'label': 'Email', 'icon': 'mail',
    'type': 'text', 'placeholder': 'We\'ll send your confirmation here', 'autoComplete': 'email',
    'validate': (val: string) => {
      if (val === '') {
        return { error: true, help: 'We\'re definitely going to need your email...' };
      }
      if (!(/(.+)@(.+){2,}\.(.+){2,}/.test(val))) {
        return { error: true, help: 'This doesn\'t look like a valid email address.' };
      }
      return { error: false };
    }
  },
  {
    'key': 'field-5', 'name': 'zip', 'label': 'Zip Code', 'icon': 'home',
    'type': 'text', 'placeholder': '27101', 'autoComplete': 'postal-code',
    'validate': (val: string) => {
      const length = 5;
      if (val.length !== length) {
        return { error: true, help: `Your Zipcode must be ${length} characters`};
      }
      return { error: false };
    }
  },
  {
    'key': 'field-6', 'name': 'promo', 'label': 'Promo', 'icon': 'gift',
    'type': 'text', 'placeholder': 'In the know?',
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

const chargeAmounts = {
  regular: { promo: 'regular', label: '$30', amount: 3000, description: '' },
  plant64: { promo: 'plant64', label: '$15', amount: 1500, description: 'Promo Code plant64 gets you 50% off! Nice!' },
  katelyn: { promo: 'katelyn', label: '$15', amount: 1500, description: 'Katelyn\'s patients get 50% off! Nice!' }
};

class Register extends React.Component<IRegisterProps, IRegisterState> {
  constructor(props: IRegisterProps) {
    super(props);
    this.state = {
      registered: false,
      confirmed: false,
      promo: '',
      paid: false,
      isLoading: false,
      attemptedSubmit: false,
      username: '',
      email: '',
      phone: '',
      password: '',
      zip: '',
      confirmationCode: '',
      formFeedback: {
        username: {},
        password: {},
        email: {},
        phone: {},
        zip: {},
        confirmationCode: {},
      },
      formError: {
        hasError: false,
        message: ''
      }
    };
  }

  validateForm = (fieldName?: string, formName: ('Register' | 'Confirmation') = 'Register') => {
    // validate form here
    let formValid = true;
    let formFeedback = this.state.formFeedback;
    // if formName is defined, use those fields. (defaults to Register)
    const formFields = formName === 'Register' ? registerFormFields : confirmationFormFields;
    // If inputName is defined, only validate the specified target
    const fieldsToValidate = fieldName ? formFields.filter(field => field.name === fieldName) : formFields;
    fieldsToValidate.forEach(field => {
      if (!field.validate) { return; }
      const validation = field.validate(this.state[field.name]);
      if (validation.error) {
        formValid = false;
        formFeedback[field.name] = this.state.attemptedSubmit ? {
          validateStatus: 'error',
          hasFeedback: true,
          help: validation.help
        } : {};
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
    this.setState({ [inputName as keyof IRegisterState]: e.currentTarget.value } as any, () => this.validateForm(inputName));
  }
  handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState({ attemptedSubmit: true }, () => {
      if (this.validateForm()) {
        this.setState({ isLoading: true }, () => {
          Auth.signUp({
            username: this.state.username,
            password: this.state.password,
            attributes: {
              email: this.state.email,
              phone_number: `+1${this.state.phone}`,
              'custom:zip': this.state.zip,
              'custom:promo': this.getCorrectedPromo()
            }
          }).then(data => {
            this.setState({ registered: true, isLoading: false });
          })
          .catch((err: any) => {
            this.setState({ isLoading: false });
          });
        });
      }
    });
  }
  handleConfirm = (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (this.validateForm(undefined, 'Confirmation')) {
      this.setState({ isLoading: true }, () => {
        Auth.confirmSignUp(this.state.username, this.state.confirmationCode)
        .then(data => {
          this.setState({ confirmed: true, isLoading: false });
        })
        .catch((err: any) => {
          this.setState({ isLoading: false });
        });
      });
    }
  }

  handlePaymentSuccess = () =>
    Auth.signIn(this.state.username, this.state.password).then(() => {
      this.setState({ paid: true });
      this.props.onRegisterSuccess();
    })
  
  renderHeader = (headerText: string) => (
    <div className="auth-form-header">
      <div className="form-greeting">{headerText}</div>
    </div>
  )

  getChargeAmount = () => {
    return chargeAmounts[this.getCorrectedPromo()];
  }

  getCorrectedPromo() {
    const enteredPromo = (this.state.promo || 'regular').trim().toLowerCase();
    return (enteredPromo in chargeAmounts) ? enteredPromo : 'regular';
  }

  renderChargeText = () => {
    const chargeAmount = this.getChargeAmount();
    if (chargeAmount.promo !== 'regular') {
      return (
        <span>
          <span style={{ textDecoration: 'line-through' }}>
            {chargeAmounts.regular.label}
          </span>
          <span style={{ fontWeight: 500, color: '#A78F5C' }}>
            {` ${chargeAmount.label}`}
            <br/>
            {chargeAmount.description}
          </span>
        </span>
      );
    }
    return (<span><span style={{ fontWeight: 500, color: '#A78F5C' }}>{chargeAmount.label}</span>.</span>);
  }
  
  renderPaymentForm = () => (
    <div className="auth-form">
      <div className="signup-modal-title">
        Connect with your <span style={{ fontWeight: 500, color: '#A78F5C' }}>personal</span> Registered Dietitian.<br/>
        Ask 15 meaningful questions for just {this.renderChargeText()}
        <div className="form-error-message">{this.state.formError.hasError ? this.state.formError.message : <br/>}</div>
      </div>
      { this.getChargeAmount().amount > 0 ?  // Only render payments form if we're charging them
          <Elements stripe={this.props.stripe}>
            <StripeCheckoutForm
              username={this.state.username || 'Nemo'}
              email={this.state.email || 'jwhite5672@gmail.com'}
              chargeAmount={this.getChargeAmount()}
              onPaymentSuccess={this.handlePaymentSuccess}
            />
          </Elements>
        :
        <div className="form-submit">
          <Button className="submit-button" onClick={this.handlePaymentSuccess}>Great!</Button>
        </div>
      }
    </div>
  )

  renderConfirmationForm = () => (
    <div className="auth-form">
      <div className="signup-modal-title">
        We sent you a <span style={{ color: '#A78F5C' }}>Confirmation Code</span> (may take a couple minutes). <br/>
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

  renderRegisterForm = () => (
    <div className="auth-form">
    <div className="signup-modal-title">
      Welcome to <span style={{ color: '#A78F5C' }}>tailRD Nutrition</span>!<br/>
      Let's get your new account set up.
      <div className="form-error-message">{this.state.formError.hasError ? this.state.formError.message : <br/>}</div>
    </div>
      <Form layout="horizontal" onSubmit={this.handleSubmit}>
        {registerFormFields.map(field => (
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
            <Button className="submit-button" htmlType="submit">Sign Up</Button>
          }
          <div className="form-submit-link">
            <NavLink to="/signin" className="form-nav-link">Already have an account?</NavLink>
          </div>
        </div>
      </Form>
    </div>
  )

  render() {
    if (this.state.paid) {
      return <Redirect to="/chat"/>;
    }
    let rendered;
    let header = '';
    if (this.state.confirmed) {
      rendered = this.renderPaymentForm();
      header = 'Ok, here\'s the last step.';
    } else if (this.state.registered) {
      rendered = this.renderConfirmationForm();
      header = 'Alright! Your account has been created!';
    } else {
      rendered = this.renderRegisterForm();
      header = 'Why, hello there!';
    }
    if (this.props.inModal) {
      rendered = (
        <Modal
          className="signup-modal"
          title={this.renderHeader(header)}
          visible={this.props.visible}
          onCancel={this.props.onClose}
          footer={null}
        >
          {rendered}
        </Modal>
      );
    } else {
      rendered = (
        <div className="auth-container">
          <Card className="auth-card register-card" title={this.renderHeader(header)} bordered={false}>
            {rendered}
          </Card>
        </div>
      );
    }

    return rendered;
  }
}

export default Register;
