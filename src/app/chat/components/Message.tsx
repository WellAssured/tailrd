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
  <div className="chat-item message" title={(new Date(props.message.timestamp)).toLocaleString()}>
    <div className="message-header">
      <div className="message-sender">{props.message.sender}</div>
    </div>
    <div className="message-content">{props.message.content}</div>
  </div>
);

export default Message;
