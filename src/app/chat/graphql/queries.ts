export interface IGetUserQueryResult {
  cognitoId: string;
  username: string;
  isDietitian: string;
  conversations: {
    items: [{
      conversationId: string;
      info: {
        createdBy: string;
        createdTime: string;
        lastActiveTime: string;
        lastMessageSummary: string;
        participants: {
          cognitoId: string;
          username: string;
        };
      };
      messages: {
        items: [{
          sender: string;
          timestamp: string;
          content: string;
        }];
        nextToken: string;
      };
    }];
    nextToken: string;
  };
}

export default {
  getUser: `
    query Login {
      getUser {
        cognitoId
        username
        isDietitian
        conversations {
          items {
            conversationId
            info {
              createdBy
              createdTime
              lastActiveTime
              lastMessageSummary
              participants {
                cognitoId
                username
              }
            }
            messages {
              items {
                sender
                timestamp
                content
              }
              nextToken
            }
          }
          nextToken
        }
      }
    }
  `,
};
