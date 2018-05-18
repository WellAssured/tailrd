import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TailrdAppContainer from './app/main/TailrdAppContainer';
import registerServiceWorker from './registerServiceWorker';

/* Google Analytics and autotrack.js */
import './analytics/tailrdTracker.ts';

import './fonts.css';
import 'antd/dist/antd.css';
import './index.css';

ReactDOM.render(<TailrdAppContainer />, document.getElementById('root'));
registerServiceWorker();
