import * as React from 'react';
import axios from 'axios';
import { Button } from 'antd';
import {
  ElementsConsumer,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js';
import { StripeElements, Stripe } from '@stripe/stripe-js';

const checkoutStyle = {
  base: {
    fontSize: '16px',
    color: '#E1E6E1',
    letterSpacing: '0.025em',
    fontFamily: 'Source Code Pro, monospace',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#f5222d',
  },
};

interface ICheckoutFormProps {
  elements: StripeElements | null;
  stripe: Stripe | null;
  username: string;
  email: string;
  chargeAmount: { code: string; label: string; amount: number; description: string };
  onPaymentSuccess: () => void;
}

interface ICheckoutFormState {
  paymentSuccess: boolean;
  isLoading: boolean;
  formError: {
    hasError: Boolean;
    message: string;
  };
}

const defaultCheckoutFormState = { paymentSuccess: false, isLoading: false, formError: { hasError: false, message: '' } };

class CheckoutForm extends React.Component<ICheckoutFormProps, ICheckoutFormState> {
  constructor(props: ICheckoutFormProps) {
    super(props);
    this.state = defaultCheckoutFormState;
  }

  submitPaymentRequest = () => {

    this.setState({ isLoading: true, formError: defaultCheckoutFormState.formError });
    const cardElement = this.props.elements!.getElement(CardNumberElement)!;
    this.props.stripe!.createToken(cardElement).then(stripeToken => {
      if (stripeToken.error) {
        this.setState({
          isLoading: false,
          formError: { hasError: true, message: stripeToken.error.message! }
        });
      } else {
        axios.post('https://api.tailrdnutrition.com/stripe/charge', {
          token: { source: stripeToken.token!.id },
          customer: { email: this.props.email },
          charge: {
            metadata: { sales_phase: 1, promocode: this.props.chargeAmount.code },
            receipt_email: this.props.email,
            amount: this.props.chargeAmount.amount,
            currency: 'usd',
            description: '15 tailRD Questions',
            statement_descriptor: '15 tailRD Questions'
          }
        }, { headers: { 'Content-Type': 'multipart/form-data'} })
        .then(response => {
          this.setState(defaultCheckoutFormState);
          if (response.data.paid && response.data.status === 'succeeded') {
            this.setState({ paymentSuccess: true });
            setTimeout(this.props.onPaymentSuccess, 500);
          } else {
            console.log('Response OK but either not paid or not succeeded');
          }
        })
        .catch(err => this.setState({
          isLoading: false,
          formError: { hasError: true, message: err.response.data.message }
        }));
      }
    });
  }

  render() {
    return (
      <div className="checkout">
        {this.state.formError.hasError && <div className="form-error-message">{this.state.formError.message}</div>}
        <label className="card-input-number">
          Card Number
          <CardNumberElement className="card-input card-input-number" options={{style: checkoutStyle}} />
        </label>
        <div className="card-info">
          <label className="card-input-exp">
            Expiration
            <CardExpiryElement className="card-input" options={{style: checkoutStyle}} />
          </label>
          <label className="card-input-cvc">
            CVC
            <CardCvcElement className="card-input" options={{style: checkoutStyle, placeholder: '000'}} />
          </label>
        </div>
        {/* <label>Zip Code<PostalCodeElement style={checkoutStyle} /></label> */}
        <div className="form-submit">
          {this.state.isLoading ?
            <Button className="submit-button" loading={true} /> :
            this.state.paymentSuccess ?
              <Button className="submit-button" icon="check" /> :
              <Button className="submit-button" onClick={this.submitPaymentRequest}>
                {`Pay ${this.props.chargeAmount.label}`}
              </Button>
          }
        </div>
        {/* <PaymentRequestButtonElement /> */}
      </div>
    );
  }
}

export default props => {
  return (
    <ElementsConsumer>
      {({elements, stripe}) => (
        <CheckoutForm elements={elements} stripe={stripe} {...props} />
      )}
    </ElementsConsumer>
  );
};