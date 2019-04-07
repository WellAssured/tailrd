export interface IParticipant {
  cognitoId: string;
  username: string;
}

export interface IConversationInfo {
  createdBy: string;
  createdTime: string;
  lastActiveTime: string;
  lastMessageSummary: string;
  participants: Array<IParticipant>;
}

export interface IConversationItem {
  conversationId: string;
  info: IConversationInfo;
  messages: {
    items: Array<IMessageItem>;
    nextToken: string;
  };
}

export interface IMessageItem {
  __typename: 'TextMessage' | 'PhotoMessage';
  sender: string;
  timestamp: string;
  content: string;
  key: string;
}

export interface IGetUserQueryResult {
  cognitoId: string;
  username: string;
  isDietitian: string;
  conversations: {
    items: Array<IConversationItem>;
    nextToken: string;
  };
}
