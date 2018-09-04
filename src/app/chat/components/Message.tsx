import * as React from 'react';

export interface IMessage {
  sender: string;
  timestamp: string;
  content: string;
}

interface IMessageProps {
  message: IMessage;
}

const Message = (props: IMessageProps) => (
  <div className="message">
    <div className="message-header">
      <div className="message-sender">{props.message.sender}</div>
      <div className="message-timestamp">{props.message.timestamp}</div>
    </div>
    <div className="message-content">{props.message.content}</div>
  </div>
);

export default Message;
