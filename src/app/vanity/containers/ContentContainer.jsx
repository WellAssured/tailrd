import React from 'react';

import './ContentContainer.css';
import Signup from '../components/SignupModal/Signup';
import HeroSection from '../components/Hero/HeroSection';
import HookSection from '../components/Hook/HookSection';
import HowSection from '../components/How/HowSection';

const questionRotationDuration = 5000;  // in ms
const QUESTION_BANK = [
  <span>does coffee give <span className="word-you">you</span> cancer?</span>,
  <span>is the keto diet healthy for <span className="word-you">you</span>?</span>,
  <span>how many calories do <span className="word-you">you</span> need?</span>,
  <span>diet that helps <span className="word-you">you</span> build muscle</span>,
  <span>sources of iron if <span className="word-you">you</span>'re vegan?</span>,
  <span>is detoxing healthy for <span className="word-you">you</span>?</span>,
  <span>is raw milk better for <span className="word-you">you</span>?</span>
];

class ContentContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      foogleQuestionIndex: 0,
      showSignupModal: true,
    };
  }

  handleSignupClick = () => this.setState({ showSignupModal: true });
  handleSignupClose = () => this.setState({ showSignupModal: false });
  handleSignupSubmit = (form) => {
    // show spinner on modal
    // submit form to Lambda
    this.setState({ showSignupModal: false });
  }

  rotateFoogleQuestion = () =>
    this.setState({
      foogleQuestionIndex: ((this.state.foogleQuestionIndex + 1) % QUESTION_BANK.length)
    });
  
  componentDidMount() {
    this.setState({
      timeoutId: window.setInterval(this.rotateFoogleQuestion, questionRotationDuration)
    });
  }

  componentWillUnmount() {
    window.clearTimeout(this.state.timeoutId);
  }

  render() {
    return (
      <div className="content-container">
        <HeroSection onSignupClick={this.handleSignupClick}/>
        <HookSection foogleQuestion={QUESTION_BANK[this.state.foogleQuestionIndex]} />
        <HowSection />
        <Signup
          visible={this.state.showSignupModal}
          onClose={this.handleSignupClose}
          onSubmit={this.handleSignupSubmit}
        />
      </div>
    );
  }
}

export default ContentContainer;
