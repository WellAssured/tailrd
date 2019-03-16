import * as React from 'react';
import { graphqlOperation, Auth, API /* , Storage */ } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';
import * as Observable from 'zen-observable';
import { Row, Col } from 'antd';

import * as GQLTypes from './graphql/gql_types';
import subscriptions from './graphql/subscriptions';
import ConversationList from './components/ConversationList';
import MessageList from './components/MessageList';
import { IMessage } from './components/Message';

import './Chat.css';

interface IChatProps {
  loading: any;
  sendMessage: (message: {convoId: string, content: string}) => void;
  userData: GQLTypes.IGetUserQueryResult;
}
interface IChatState {
  loading: boolean;
  user?: CognitoUser;
  activeConversation: number;
  conversations: Array<GQLTypes.IConversationItem>;
}

class Chat extends React.Component<IChatProps, IChatState> {
  constructor(props: IChatProps) {
    super(props);
    this.state = { loading: true, user: undefined, activeConversation: 0, conversations: [] };
    Auth.currentAuthenticatedUser().then(u => this.setState({ user: u }));
  }

  componentDidUpdate(prevProps: IChatProps) {
    if (this.props.userData !== undefined && prevProps.userData === undefined && this.props.userData.conversations.items.length > 0) {
      // Done Loading!
      this.setState({ loading: false, conversations: this.props.userData.conversations.items }, () =>
        // After putting the conversations in our state, we need to subscribe to all of our conversations
        this.state.conversations.forEach((convo: GQLTypes.IConversationItem) =>
          (API.graphql(graphqlOperation(
            subscriptions.newMessage,
            { convoId: convo.conversationId }
          )) as Observable<any>).subscribe(({ value }) => this.handleNewMessage(convo.conversationId, value.data))
        )
      );
    }
  }

  handleConvoClick = (convoId: string) => {
    this.setState({ activeConversation: this.state.conversations.findIndex(c => c.conversationId === convoId) });
  }

  handleNewMessage = (convoId: string, data: { newMessage: IMessage}) => {
    const convoIndex = this.state.conversations.findIndex(c => c.conversationId === convoId);
    if (convoIndex !== -1) {
      const conversation = this.state.conversations[convoIndex];
      // add the new message to the conversation
      conversation.messages.items.unshift(data.newMessage);
      const currentConvos = this.state.conversations;
      currentConvos[convoIndex] = conversation;
      // replace the old conversation with the updated one
      this.setState({ conversations: currentConvos });
    }
  }

  // handlePhotoUpload = (photoFile) => {
  //   return Storage.put(photoFile.name, photoFile.data, {
  //       level: 'protected',
  //       contentType: photoFile.type
  //   });
  // }

  renderConvoList() {
    return (
      <ConversationList
        currentUser={this.state.user!}
        activeConversationId={this.state.conversations[this.state.activeConversation].conversationId}
        conversations={this.state.conversations}
        onConvoClick={this.handleConvoClick}
      />
    );
  }

  renderMessageList() {
    if (this.props.userData.conversations.items.length > 0) {
      return (
        <MessageList
          handleNewMessage={this.props.sendMessage}
          // handlePhotoUpload={this.handlePhotoUpload}
          activeConversationId={this.state.conversations[this.state.activeConversation].conversationId}
          messages={this.state.conversations[this.state.activeConversation].messages.items}
          currentUser={this.state.user!}
          participants={this.state.conversations[this.state.activeConversation].info.participants}
        />
      );
    } else {
      return <span />;
    }
  }

  renderChatApp = () => {
    if (this.state.loading) {
      return (<div className="chat-app">Loading...</div>);
    }
    return (
      <Row className="chat-app">
        {this.props.userData.isDietitian &&
          <Col span={6} className="list-container conversationList-container">
            {this.renderConvoList()}
          </Col>
        }
        <Col span={this.props.userData.isDietitian ? 18 : 24} className="list-container messageList-container">
          {this.renderMessageList()}
        </Col>
      </Row>
    );
  }

  render() {
    return this.renderChatApp();
  }
}

export default Chat;
