import React from 'react';
import _ from 'lodash';

import logo from '../../../../assets/logo.svg';
import './HookSection.css';

const NUMBER_OF_QUESTION_BUBBLES = 5;
const QUESTION_BANK = [
  <span>does coffee give <span className="word-you">you</span> cancer?</span>,
  <span>is the keto diet healthy for <span className="word-you">you</span>?</span>,
  <span>how many calories do <span className="word-you">you</span> need in a day?</span>,
  <span>diet that helps <span className="word-you">you</span> build muscle</span>,
  <span>sources of iron if <span className="word-you">you</span>'re vegan?</span>
];

const NUMBER_OF_LOGOS = 20;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function renderMovingFoogleBackground () {
  return (
    <div className="moving-background">
      { _.times(NUMBER_OF_QUESTION_BUBBLES, i => {
        const leftStart = `${getRandomInt(-25, 75)}%`;
        const duration = `${getRandomInt(3, 7)}s`;
        const delay = `${getRandomInt(0, 3) + i}s`;
        return (
          <div key={i} className="foogle-search-box moving-bubble" style={{
            left: leftStart,
            animation: `drop-down ${duration} linear ${delay} infinite`
          }}>
            <span className="question-text">{QUESTION_BANK[i % QUESTION_BANK.length]}</span>
          </div>
        );
      })}
    </div>
  );
};

function renderMovingLogoBackground () {
  return (
    <div className="moving-background">
      { _.times(NUMBER_OF_LOGOS, i => {
        const bottomStart = `${getRandomInt(-50, 125)}vw`;
        const duration = `${getRandomInt(5, 10)}s`;
        const delay = `${getRandomInt(0, 3)}s`;
        return (
          <div key={i} className="moving-logo" style={{
            bottom: bottomStart,
            animation: `fly-up ${duration} linear ${delay} infinite`
          }}>
            <img src={logo} className="small-logo" alt="logo"/>
          </div>
        );
      })}
    </div>
  );
};

const HookSection = () => (
  <div className="hook-section content-section">
    <div className="content-pane content-pane-left">
      {renderMovingFoogleBackground()}
      <div className="content-pane-title">
        <h3>Stop <span className="title-verb">searching</span>...</h3>
      </div>
      <div className="content-app-container">
        <div className="content-app foogle-app-demo">
          <div className="foogle-search-box">
            <span>is detoxing healthy for <span className="word-you">you</span>?</span>
          </div>
          <div className="foogle-search-button">
            Feeling Lucky?
          </div>
        </div>
      </div>
    </div>
    <div className="content-pane content-pane-right">
      {renderMovingLogoBackground()}
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
            <span>Hi Liz! You're correct, it is recommended that pregnant women avoid seafood that contains high amounts of mercury, such as swordfish and mackerel. Mercury could interfere with the healthy development of your baby. However, salmon is not one of those and actually contains DHA which aids in health development.</span>
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