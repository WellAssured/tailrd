import * as React from 'react';
import { graphqlOperation, Auth } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';

import queries, { IGetUserQueryResult } from './graphql/queries';
import ConversationList from './components/ConversationList';
import MessageList from './components/MessageList';

import './Chat.css';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Row, Col } from 'antd';

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
    return (<MessageList messages={this.unpackMessages(data.data.getUser)}/>);
  }

  renderChatApp = (data: any) => {
    if (data.loading || data.data.getUser === undefined) {
      return (<div>Loading...</div>);
    }
    if (data.error) {
      return (<div>Errors</div>);
    }
    return (
      <Row className="chat-app">
        {data.data.getUser.isDietitian &&
          <Col span={6} className="conversationList-container">{this.renderConvoList(data)}</Col>
        }
        <Col span={18} className="messageList-container">{this.renderMessageList(data)}</Col>
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
