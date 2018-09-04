import * as React from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';

import Message, { IMessage } from './Message';

interface IMessageListProps {
  handleNewMessage: (message: IMessage) => void;
  messages: IMessage[];
  currentUser: CognitoUser;
  participants: {
    cognitoId: string;
    username: string;
  }[];
}
interface IMessageListState {
  message: string;
}

class MessageList extends React.Component<IMessageListProps, IMessageListState> {
  constructor(props: IMessageListProps) {
    super(props);
    this.state = {
      message: 'NEW MESSAGE TEXT',
    };
  }

  render() {
    return (
      <div className="messageList-messageBox">
        <div className="chat-list messageList">
          {this.props.messages.map((c, i) => {
            const pSender = this.props.participants.find(p => p.cognitoId === c.sender);
            const sender = pSender === undefined ? 'Unknown' : pSender.username;
            return (
              <div
                key={`convo-${i}`}
                className={`message-container message-float-${sender === this.props.currentUser.getUsername() ? 'right' : 'left'}`}
              >
                <Message message={{ ...c, ...{ sender }}} />
              </div>
            );
          })}
        </div>
        <div className="message-box">{this.state.message}</div>
      </div>
    );
  }
}

export default MessageList;
