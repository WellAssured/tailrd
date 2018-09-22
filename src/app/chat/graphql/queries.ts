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
