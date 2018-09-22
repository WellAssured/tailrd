import * as React from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';

import { IConversationItem as IConversation } from '../graphql/gql_types';

interface IConversationProps {
  currentUser: CognitoUser;
  active: boolean;
  conversation: IConversation;
  onConvoClick: (convoId: string) => void;
}

const Conversation = (props: IConversationProps) => (
  <div
    // Only allow convo click if not currently the active conversation
    onClick={() => { if (!props.active) { props.onConvoClick(props.conversation.conversationId); } }}
    className={`chat-item conversation${props.active ? ' conversation-active' : ''}`}
  >
    <div className="conversation-participants">
       {/* Only show participants that are not the current user */}
      {props.conversation.info.participants.filter(p => (p.username !== props.currentUser.getUsername())).map(p => p.username)}
    </div>
    {/* <div className="conversation-lastActiveTime">{
      (new Date(props.conversation.lastActiveTime)).toLocaleString()
    }</div> */}
    <div className="conversation-lastMessageSummary">{props.conversation.info.lastMessageSummary}</div>
  </div>
);

export default Conversation;
