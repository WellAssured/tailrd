import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';
import TailrdAppContainer from './app/main/TailrdAppContainer';
import registerServiceWorker from './registerServiceWorker';

import amplify_config from './aws_config';

/* Google Analytics and autotrack.js */
import './analytics/tailrdTracker.ts';

import './fonts.css';
import 'antd/dist/antd.css';
import './index.css';

Amplify.configure(amplify_config);
ReactDOM.render(<TailrdAppContainer />, document.getElementById('root'));
registerServiceWorker();
