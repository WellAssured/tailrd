import * as React from 'react';
import { graphqlOperation, Auth, API } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';
import * as Observable from 'zen-observable';
import { Row, Col } from 'antd';

import { IGetUserQueryResult } from './graphql/queries';
import subscriptions from './graphql/subscriptions';
import ConversationList from './components/ConversationList';
import MessageList from './components/MessageList';
import { IMessage } from './components/Message';

import './Chat.css';

interface IChatProps {
  loading: any;
  sendMessage: (message: {convoId: string, content: string}) => void;
  userData: IGetUserQueryResult;
}
interface IChatState {
  user?: CognitoUser;
  activeConversation: number;
  newMessages: Array<IMessage>;
}

class Chat extends React.Component<IChatProps, IChatState> {
  constructor(props: IChatProps) {
    super(props);
    this.state = { user: undefined, activeConversation: 0, newMessages: [] };
    Auth.currentAuthenticatedUser().then(u => this.setState({ user: u }));
  }

  componentDidUpdate(prevProps: IChatProps) {
    if (this.props.userData !== undefined && prevProps.userData === undefined && this.props.userData.conversations.items.length > 0) {
      // if (this.props.userData.isDietitian) {
      //   (API.graphql(graphqlOperation(subscriptions.newMessage)) as Observable<any>).subscribe(({ value }) => this.handleNewMessage(value.data));
      // } else {
      (API.graphql(graphqlOperation(subscriptions.newMessage, { convoId: this.props.userData.conversations.items[0].conversationId })) as Observable<any>).subscribe(({ value }) => this.handleNewMessage(value.data));
      // }
    }
  }

  handleNewMessage = (data: { newMessage: IMessage}) => {
    const newMessages = this.state.newMessages;
    newMessages.unshift(data.newMessage);
    this.setState({ newMessages });
  }

  unpackConversations = (data: IGetUserQueryResult) => {
    return data.conversations.items.map((convo: IGetUserQueryResult['conversations']['items'][0]) => ({
      participants: convo.info.participants.filter(
        (p: IGetUserQueryResult['conversations']['items'][0]['info']['participants'][0]) => p.username !== this.state.user!.getUsername()
      ).map((p: IGetUserQueryResult['conversations']['items'][0]['info']['participants'][0]) => p.username),
      lastActiveTime: convo.info.lastActiveTime,
      lastMessageSummary: convo.info.lastMessageSummary
    }));
  }

  unpackMessages = (data: IGetUserQueryResult) => {
    return [...this.state.newMessages, ...data.conversations.items[this.state.activeConversation].messages.items];
  }

  renderConvoList() {
    return (<ConversationList conversations={this.unpackConversations(this.props.userData)}/>);
  }

  renderMessageList() {
    if (this.props.userData.conversations.items.length > 0) {
      return (
        <MessageList
          handleNewMessage={this.props.sendMessage}
          activeConversationId={this.props.userData.conversations.items[this.state.activeConversation].conversationId}
          messages={this.unpackMessages(this.props.userData)}
          currentUser={this.state.user!}
          participants={this.props.userData.conversations.items[this.state.activeConversation].info.participants}
        />
      );
    } else {
      return <span />;
    }
  }

  renderChatApp = () => {
    if (this.props.loading || this.props.userData === undefined) {
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
