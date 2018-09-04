import * as React from 'react';

import Conversation, { IConversation } from './Conversation';

interface IConversationListProps {
  conversations: IConversation[];
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
          <Conversation key={`convo-${i}`} conversation={c} />
        )}
      </div>
    );
  }
}

export default ConversationList;
