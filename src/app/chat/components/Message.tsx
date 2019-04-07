import * as React from 'react';

export interface IMessage {
  __typename: 'TextMessage' | 'PhotoMessage';
  conversationId?: string;
  sender: string;
  timestamp: string;
  content: string;
  key: string;
}

interface IMessageProps {
  message: IMessage;
}

const renderMessageContent = (message: IMessage) => {
  switch (message.__typename) {
  case 'PhotoMessage':
    return <img width="300" className="message-content message-content-image" src={message.key} />;
  case 'TextMessage': default:
    return <div className="message-content">{message.content}</div>;
  }
};

const Message = (props: IMessageProps) => (
  <div className="chat-item message" title={(new Date(props.message.timestamp)).toLocaleString()}>
    <div className="message-header">
      <div className="message-sender">{props.message.sender === 'Unknown' ? 'TailRD' : props.message.sender}</div>
    </div>
    {renderMessageContent(props.message)}
  </div>
);

export default Message;
