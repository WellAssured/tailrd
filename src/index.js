import React from 'react';
import ReactDOM from 'react-dom';
import TailrdAppContainer from './app/main/TailrdAppContainer';
import registerServiceWorker from './registerServiceWorker';

import './fonts.css';
import 'antd/dist/antd.css';
import './index.css';

ReactDOM.render(<TailrdAppContainer />, document.getElementById('root'));
registerServiceWorker();
