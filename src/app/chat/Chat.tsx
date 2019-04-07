import * as React from 'react';
import Axios from 'axios';
import { graphqlOperation, Auth, API /* , Storage */ } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';
import * as Observable from 'zen-observable';
import { Row, Col } from 'antd';

import { GraphQLResult } from '@aws-amplify/api/lib/types';
import * as GQLTypes from './graphql/gql_types';
import mutations from './graphql/mutations';
import subscriptions from './graphql/subscriptions';
import ConversationList from './components/ConversationList';
import MessageList, { IPhoto } from './components/MessageList';
import { IMessage } from './components/Message';

import './Chat.css';

import { Photo } from './components/MessageList';

interface IChatProps {
  loading: any;
  userData: GQLTypes.IGetUserQueryResult;
}
interface IChatState {
  loading: boolean;
  sendTextMessage: (message: {convoId: string, content: string}) => Promise<GraphQLResult> | Observable<object>;
  sendPhotoMessage: (message: {convoId: string, key: string}) => Promise<GraphQLResult> | Observable<object>;
  user?: CognitoUser;
  activeConversation: number;
  conversations: Array<GQLTypes.IConversationItem>;
}

class Chat extends React.Component<IChatProps, IChatState> {
  constructor(props: IChatProps) {
    super(props);
    this.state = {
      loading: true,
      sendTextMessage: (message: {convoId: string, content: string}) => API.graphql(graphqlOperation(mutations.sendText, message)),
      sendPhotoMessage: (message: {convoId: string, key: string}) => API.graphql(graphqlOperation(mutations.sendPhoto, message)),
      user: undefined,
      activeConversation: 0,
      conversations: []
    };

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

  handlePhotoUpload = async (convoId: string, photo: IPhoto) => {
    // first get the signed post url
    const response = await Axios.post(
      'https://api.tailrdnutrition.com/lambda/photo-upload',
      { conversationId: convoId, ext: photo.type }
    );

    if (response.status === 200) {
      // upload the photo using the response
      const uploadData = new FormData();
      Object.keys(response.data.fields).forEach((key) => {
        uploadData.append(key, response.data.fields[key]);
      });
      const imageBlob = new Blob([photo.data], { type: 'image/png' });
      uploadData.append('file', imageBlob);
      return Axios.post(response.data.url, uploadData);
    } else {
      return Promise.reject();
    }
  }

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
          handleNewTextMessage={this.state.sendTextMessage}
          handleNewPhotoMessage={this.state.sendPhotoMessage}
          handlePhotoUpload={this.handlePhotoUpload}
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
