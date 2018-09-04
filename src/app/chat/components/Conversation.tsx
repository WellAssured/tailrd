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
  <div className="conversation">
    <div className="conversation-participants">{props.conversation.participants}</div>
    <div className="conversation-lastActiveTime">{props.conversation.lastActiveTime}</div>
    <div className="conversation-lastMessageSummary">{props.conversation.lastMessageSummary}</div>
  </div>
);

export default Conversation;
