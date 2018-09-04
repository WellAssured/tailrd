import * as React from 'react';

import Message, { IMessage } from './Message';

interface IMessageListProps {
  messages: IMessage[];
}
interface IMessageListState {}

class MessageList extends React.Component<IMessageListProps, IMessageListState> {
  constructor(props: IMessageListProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="messageList">
        {this.props.messages.map((c, i) =>
          <Message key={`convo-${i}`} message={c} />
        )}
      </div>
    );
  }
}

export default MessageList;
