import * as React from 'react';
import { Button } from 'antd';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  // PostalCodeElement,
  // PaymentRequestButtonElement,
  injectStripe,
  ReactStripeElements
} from 'react-stripe-elements';

const checkoutStyle = {
  base: {
    fontSize: '16px',
    lineHeight: '21px',
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

interface ICheckoutFormProps extends ReactStripeElements.InjectedStripeProps {
  username: string;
}

class CheckoutForm extends React.Component<ICheckoutFormProps> {
  constructor(props: ICheckoutFormProps) {
    super(props);
  }

  submitPaymentRequest = () => {
    this.props.stripe!.createToken().then(stripeToken => {
      console.log(stripeToken);
      console.log(this.props.username);
    });
  }

  render() {
    return (
      <div className="checkout">
        <label className="card-input-number">Card Number<CardNumberElement className="card-input card-input-number" style={checkoutStyle} /></label>
        <div className="card-info">
          <label className="card-input-exp">Expiration<CardExpiryElement className="card-input" style={checkoutStyle} /></label>
          <label className="card-input-cvc">CVC<CardCVCElement className="card-input" style={checkoutStyle} /></label>
        </div>
        {/* <label>Zip Code<PostalCodeElement style={checkoutStyle} /></label> */}
        <div className="form-submit">
          <Button className="submit-button" onClick={this.submitPaymentRequest}>Pay $30</Button>
        </div>
        {/* <PaymentRequestButtonElement /> */}
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);