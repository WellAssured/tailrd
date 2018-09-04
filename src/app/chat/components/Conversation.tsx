import * as React from 'react';

export interface IConversation {
  participants: [string];
  lastActiveTime: string;
  lastMessageSummary: string;
}

interface IConversationProps {
  conversation: IConversation;
}

const Conversation = (props: IConversationProps) => (
  <div className="chat-item conversation">
    <div className="conversation-participants">{props.conversation.participants}</div>
    {/* <div className="conversation-lastActiveTime">{
      (new Date(props.conversation.lastActiveTime)).toLocaleString()
    }</div> */}
    <div className="conversation-lastMessageSummary">{props.conversation.lastMessageSummary}</div>
  </div>
);

export default Conversation;
