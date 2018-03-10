import React from 'react';

import logo from '../../../../assets/logo.svg';
import './HookSection.css';

const QUESTION_BANK = [
  <span>does coffee give <span className="word-you">you</span> cancer?</span>,
  <span>is the keto diet healthy for <span className="word-you">you</span>?</span>,
  <span>how many calories do <span className="word-you">you</span> need in a day?</span>,
  <span>diet that helps <span className="word-you">you</span> build muscle</span>,
  <span>sources of iron if <span className="word-you">you</span>'re vegan?</span>,
  <span>is detoxing healthy for <span className="word-you">you</span>?</span>
];

const HookSection = () => (
  <div className="hook-section content-section">
    <div className="content-pane content-pane-left">
      <div className="content-pane-title">
        <h3>Stop <span className="title-verb">searching</span>...</h3>
      </div>
      <div className="content-app-container">
        <div className="content-app foogle-app-demo">
          <div className="foogle-search-box">
            {QUESTION_BANK[5]}
          </div>
          <div className="foogle-search-button">
            Feeling Lucky?
          </div>
        </div>
      </div>
    </div>
    <div className="content-pane content-pane-right">
      <div className="content-pane-title">
        <h3>Start <span className="title-verb title-emphasis">learning.</span></h3>
      </div>
      <div className="content-app-container">
        <div className="content-app tailrd-app-demo">
          <div className="app-header">
            <img src={logo} className="small-logo" alt="logo"/>
          </div>
          <div className="chat-bubble me-chat">
            <span>Hi again Lora! I've heard that pregnant women should stay away from seafood because of the mercury. Can I eat grilled salmon for dinner tonight?</span>
          </div>
          <div className="chat-bubble rd-chat">
            <span>Hi Liz! You're correct, it is recommended that pregnant women avoid seafood that contains high amounts of mercury, such as swordfish and mackerel. Mercury could interfere with the healthy development of your baby. However, salmon is not one of those and actually contains DHA which aids in healthy development.</span>
          </div>
          <div className="chat-bubble me-chat">
            <span>Great, thanks! I can't stand the thought of chicken right now.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HookSection;