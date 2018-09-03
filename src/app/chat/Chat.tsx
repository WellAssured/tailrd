import * as React from 'react';
import { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';

import queries from './graphql/queries';

import './Chat.css';

const Chat = () => (
  <Connect query={graphqlOperation(queries.getUser)}>
      {(data: any) => (
        <div className="chat-data">
          ${JSON.stringify(data)}
        </div>
      )}
  </Connect>
);

export default Chat;
