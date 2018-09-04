import * as React from 'react';
import { graphqlOperation, Auth } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Row, Col } from 'antd';

import queries, { IGetUserQueryResult } from './graphql/queries';
import ConversationList from './components/ConversationList';
import MessageList from './components/MessageList';

import './Chat.css';
import { IMessage } from './components/Message';

interface IChatProps {}
interface IChatState {
  user?: CognitoUser;
  activeConversation: number;
}

class Chat extends React.Component<IChatProps, IChatState> {
  constructor(props: IChatProps) {
    super(props);
    this.state = { user: undefined, activeConversation: 0 };
    Auth.currentAuthenticatedUser().then(u => this.setState({ user: u }));
  }

  onSendMessage = (conversationId: string, message: IMessage) => {
    console.log(conversationId);
    console.log(message.content);
  }

  unpackConversations = (data: IGetUserQueryResult) => {
    return data.conversations.items.map((convo: any) => ({
      participants: convo.info.participants.filter(
        (p: IGetUserQueryResult['conversations']['items'][0]['info']['participants']) => p.username !== this.state.user!.getUsername()
      ).map((p: IGetUserQueryResult['conversations']['items'][0]['info']['participants']) => p.username),
      lastActiveTime: convo.info.lastActiveTime,
      lastMessageSummary: convo.info.lastMessageSummary
    }));
  }

  unpackMessages = (data: IGetUserQueryResult) => {
    return data.conversations.items[this.state.activeConversation].messages.items;
  }

  renderConvoList(data: any) {
    return (<ConversationList conversations={this.unpackConversations(data.data.getUser)}/>);
  }

  renderMessageList(data: any) {
    return (
      <MessageList
        handleNewMessage={(message: IMessage) => this.onSendMessage(
          data.data.getUser.conversations.items[this.state.activeConversation].conversationId,
          message
        )}
        messages={this.unpackMessages(data.data.getUser)}
        currentUser={this.state.user!}
        participants={data.data.getUser.conversations.items[this.state.activeConversation].info.participants}
      />
    );
  }

  renderChatApp = (data: any) => {
    if (data.loading || data.data.getUser === undefined) {
      return (<div className="chat-app">Loading...</div>);
    }
    if (data.error) {
      return (<div className="chat-app">Errors</div>);
    }
    return (
      <Row className="chat-app">
        {data.data.getUser.isDietitian &&
          <Col span={6} className="list-container conversationList-container">
            {this.renderConvoList(data)}
          </Col>
        }
        <Col span={data.data.getUser.isDietitian ? 18 : 24} className="list-container messageList-container">
          {this.renderMessageList(data)}
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <Connect query={graphqlOperation(queries.getUser)}>
        {(data: any) => this.renderChatApp(data)}
      </Connect>
    );
  }
}

export default Chat;
