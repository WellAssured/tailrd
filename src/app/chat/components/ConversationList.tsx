import * as React from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';

import { IConversationItem as IConversation } from '../graphql/gql_types';
import Conversation from './Conversation';

interface IConversationListProps {
  currentUser: CognitoUser;
  activeConversationId: string;
  conversations: Array<IConversation>;
  onConvoClick: (convoId: string) => void;
}
interface IConversationListState {}

class ConversationList extends React.Component<IConversationListProps, IConversationListState> {
  constructor(props: IConversationListProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="chat-list conversationList">
        {this.props.conversations.map((c, i) =>
          <Conversation
            key={`convo-${i}`}
            conversation={c}
            active={(c.conversationId === this.props.activeConversationId)}
            currentUser={this.props.currentUser}
            onConvoClick={this.props.onConvoClick}
          />
        )}
      </div>
    );
  }
}

export default ConversationList;
