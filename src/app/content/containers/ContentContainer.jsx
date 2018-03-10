import React from 'react';

import './ContentContainer.css';
import HeroSection from '../components/Hero/HeroSection';
import HookSection from '../components/Hook/HookSection';
import HowSection from '../components/How/HowSection';

const ContentContainer = () => (
  <div className="content-container">
    <HeroSection />
    <HookSection />
    <HowSection />
  </div>
);

export default ContentContainer;
