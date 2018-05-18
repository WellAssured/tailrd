import * as React from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';

import './ContentContainer.css';
import Signup from '../components/SignupModal/Signup';
import HeroSection from '../components/Hero/HeroSection';
import HookSection from '../components/Hook/HookSection';
import HowSection from '../components/How/HowSection';

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

interface IProps {}

interface IState {
  foogleQuestionIndex: number;
  showSignupModal: boolean;
  isLoading: boolean;
  signupStatus: string;
  signupMessage: string;
  timeoutId: number;
}

class ContentContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      foogleQuestionIndex: 0,
      showSignupModal: false,
      isLoading: false,
      signupStatus: '',
      signupMessage: '',
      timeoutId: -1
    };
  }

  handleSignupClick = () => this.setState({ showSignupModal: true });
  handleSignupClose = () => this.setState({ showSignupModal: false });
  handleSignupSuccess = (response: AxiosResponse) => {
    this.setState({
      isLoading: false,
      signupStatus: 'success',
      signupMessage: 'You should hear from us real soon.'
    });
  }
  handleSignupFailure = (error: AxiosError) => {
    let signupMessage = 'Something went wrong. Please try again later.';
    if (error.response!.data.errorResponseData.status === 400) { // error.response.data.errorResponseData.title === 'Member Exists'
      signupMessage = 'Looks like you\'ve already signed up with this email address.';
    }
    this.setState({ isLoading: false, signupStatus: 'error', signupMessage });
  }
  handleSignupSubmit = (form: Object) => {
    // show spinner on modal
    // submit form to Lambda and Lambda to Mailchimp
    const mailingURL = 'https://api.tailrdnutrition.com/v1/tailrd-mailinglist';
    axios.post(mailingURL, { ...form }, { headers: { 'Content-Type': 'multipart/form-data'} })
      .then(response => this.handleSignupSuccess(response))
      .catch(error => this.handleSignupFailure(error));

    this.setState({ isLoading: true });
  }

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
    return (
      <div className="content-container">
        <HeroSection onSignupClick={this.handleSignupClick}/>
        <HookSection foogleQuestion={QUESTION_BANK[this.state.foogleQuestionIndex]} />
        <HowSection />
        <Signup
          visible={this.state.showSignupModal}
          isLoading={this.state.isLoading}
          signupStatus={this.state.signupStatus}
          signupMessage={this.state.signupMessage}
          onClose={this.handleSignupClose}
          onSubmit={this.handleSignupSubmit}
        />
      </div>
    );
  }
}

export default ContentContainer;
