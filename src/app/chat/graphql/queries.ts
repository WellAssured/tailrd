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
                __typename
                sender
                timestamp
                ... on TextMessage {
                  content
                }
                ... on PhotoMessage {
                  key
                }
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
