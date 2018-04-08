import React from 'react';
import ReactDOM from 'react-dom';
import TailrdAppContainer from './app/main/TailrdAppContainer';
import registerServiceWorker from './registerServiceWorker';

/* Google Analytics and autotrack.js */
import './analytics/tailrdTracker.js';

import './fonts.css';
import 'antd/dist/antd.css';
import './index.css';

ReactDOM.render(<TailrdAppContainer />, document.getElementById('root'));
registerServiceWorker();
