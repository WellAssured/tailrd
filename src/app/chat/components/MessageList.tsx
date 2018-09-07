import * as React from 'react';
import { Input, Icon } from 'antd';
import { Element, scroller } from 'react-scroll';
import { CognitoUser } from 'amazon-cognito-identity-js';

import Message, { IMessage } from './Message';

interface IMessageListProps {
  handleNewMessage: ({}: {convoId: string, content: string}) => void;
  messages: Array<IMessage>;
  activeConversationId: string;
  currentUser: CognitoUser;
  participants: Array<{
    cognitoId: string;
    username: string;
  }>;
}
interface IMessageListState {
  message: string;
}

class MessageList extends React.Component<IMessageListProps, IMessageListState> {
  constructor(props: IMessageListProps) {
    super(props);
    this.state = {
      message: ''
    };
  }

  componentDidMount() {
    scroller.scrollTo('bottom', {containerId: 'messageList'});
  }
  componentDidUpdate(prevProps: IMessageListProps) {
    if (this.props.messages.length !== prevProps.messages.length) {
      scroller.scrollTo('bottom', {containerId: 'messageList'});
    }
  }

  sendMessage = () => {
    if (this.state.message.length > 0) {
      const content = this.state.message;
      this.setState({ message: '' });
      this.props.handleNewMessage({convoId: this.props.activeConversationId, content: content});
    }
  }

  renderMessageInput() {
    return (
      <div className="message-box-container">
        <div className="message-box">
          <Input.TextArea
            value={this.state.message}
            placeholder={
              this.props.participants.length > 2 ? 
                'Message this group' :
                `Message ${this.props.participants.find(p => p.username !== this.props.currentUser.getUsername())!.username}`
            }
            autosize={{ maxRows: 6 }}
            onChange={(e:  React.FormEvent<HTMLTextAreaElement>) => this.setState({ message: e.currentTarget.value })}
          />
          <Icon
            type="up-circle"
            theme="outlined"
            className={`send-message-button ${this.state.message.length === 0 ? 'cannot-send' : ''}`}
            onClick={this.sendMessage}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="messageList-messageBox">
        <div className="chat-list messageList" id="messageList">
          {[...this.props.messages].reverse().map((c, i) => {
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
          <Element name="bottom" />
        </div>
        {this.renderMessageInput()}
      </div>
    );
  }
}

export default MessageList;
