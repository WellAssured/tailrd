import * as React from 'react';
import { Redirect } from 'react-router';

import './ContentContainer.css';
import { Register } from '../../auth';
import HeroSection from '../components/Hero/HeroSection';
import HookSection from '../components/Hook/HookSection';
import HowSection from '../components/How/HowSection';
import { Stripe } from '@stripe/stripe-js';

const questionRotationDuration = 5000;  // in ms
const QUESTION_BANK = [
  <span key="1">does coffee give <span className="word-you">you</span> cancer?</span>,
  <span key="2">is the keto diet healthy for <span className="word-you">you</span>?</span>,
  <span key="3">how many calories do <span className="word-you">you</span> need?</span>,
  <span key="4">diet that helps <span className="word-you">you</span> build muscle</span>,
  <span key="5">sources of iron if <span className="word-you">you</span>'re vegan?</span>,
  <span key="6">is detoxing healthy for <span className="word-you">you</span>?</span>,
  <span key="7">is raw milk better for <span className="word-you">you</span>?</span>
];

interface IProps {
  authenticated: boolean;
  stripe: Promise<Stripe | null>;
  onRegisterSuccess: () => void;
}

interface IState {
  goToChat: boolean;
  foogleQuestionIndex: number;
  showSignupModal: boolean;
  timeoutId: number;
}

class ContentContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      goToChat: false,
      foogleQuestionIndex: 0,
      showSignupModal: false,
      timeoutId: -1
    };
  }

  handleSignupClick = () => {
    if (this.props.authenticated) {
      this.setState({ goToChat: true });
    } else {
      this.setState({ showSignupModal: true });
    }
  }
  handleSignupClose = () => this.setState({ showSignupModal: false });

  rotateFoogleQuestion = () =>
    this.setState({
      foogleQuestionIndex: ((this.state.foogleQuestionIndex + 1) % QUESTION_BANK.length)
    })
  
  componentDidMount() {
    this.setState({
      timeoutId: window.setInterval(this.rotateFoogleQuestion, questionRotationDuration)
    });
  }

  componentWillUnmount() {
    window.clearTimeout(this.state.timeoutId);
  }

  render() {
    if (this.state.goToChat) {
      return <Redirect to="/chat" />;
    }
    return (
      <div className="content-container">
        <HeroSection onSignupClick={this.handleSignupClick}/>
        <HookSection foogleQuestion={QUESTION_BANK[this.state.foogleQuestionIndex]} />
        <HowSection />
        <Register
          visible={this.state.showSignupModal}
          onClose={this.handleSignupClose}
          inModal={true}
          stripe={this.props.stripe}
          onRegisterSuccess={this.props.onRegisterSuccess}
        />
      </div>          
    );
  }
}

export default ContentContainer;
