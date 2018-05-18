import * as React from 'react';

import './HookSection.css';

interface IProps {
  foogleQuestion: JSX.Element;
}

const HookSection = (props: IProps) => (
  <div className="hook-section content-section">
    <div className="content-pane content-pane-left">
      <div className="content-pane-title">
        <h3>Stop <span className="negative-word title-verb">searching</span>...</h3>
        <h5>Searching for health answers online leads to information that is generic and unhelpful, or worse, opinions that can actually be <span className="negative-word">harmful</span>.</h5>
      </div>
      <div className="content-app-container">
        <div className="content-app foogle-app-demo">
          <div className="foogle-search-box">
            {props.foogleQuestion}
          </div>
          <div className="foogle-search-button">
            Feeling Lucky?
          </div>
        </div>
      </div>
    </div>
    <div className="content-pane content-pane-right">
      <div className="content-pane-title">
        <h3>Start <span className="positive-word title-verb">learning</span>.</h3>
        <h5>Registered Dietitians are the only ones that can legally give diet advice to those with health conditions – so get your answers <span className="positive-word">tailored</span>.</h5>
      </div>
      <div className="content-app-container">
        <div className="content-app tailrd-app-demo">
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