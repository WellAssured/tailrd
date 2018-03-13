import React from 'react';
import { Icon } from 'antd';

import './HowSection.css';

const HowSection = () => (
  <div className="how-section content-section">
    <div className="how-section-title">
      <h2>How it works</h2>
    </div>
    <div className="how-block-container">
      <div className="how-block">
        <div className="how-block-title"><h3>Sign Up</h3></div>
        <div className="how-block-graphic">
          <Icon type="profile" style={{ fontSize: '3em' }}/>
        </div>
        <div className="how-block-description">
          Set up your profile by answering a few questions about your personal health.
        </div>
      </div>
      <div className="how-block">
        <div className="how-block-title"><h3>Connect</h3></div>
        <div className="how-block-graphic">
          {/* <div className="how-block-graphic-row">
            <Icon type="video-camera" className="how-icon" style={{ fontSize: '1.5em' }} />
            <Icon type="phone" className="how-icon" style={{ fontSize: '1.5em' }} />
          </div>
          <div className="how-block-graphic-row"> */}
            <Icon type="message" className="how-icon" style={{ fontSize: '3em' }} />
            {/* <Icon type="mail" className="how-icon" style={{ fontSize: '1.5em' }} />
          </div> */}
        </div>
        <div className="how-block-description">
          Use the <span className="tailrd-span">tailRD</span> messaging service to chat with your personal Registered Dietitian.
        </div>
      </div>
      <div className="how-block">
        <div className="how-block-title"><h3>Be Healthy</h3></div>
        <div className="how-block-graphic">
          <Icon type="heart" style={{ fontSize: '3em' }}/>
        </div>
        <div className="how-block-description">Get personalized advice and check-ins and unlock your healthiest life!</div>
      </div>
    </div>
  </div>
);

export default HowSection;