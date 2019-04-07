export default {
  newMessage: `
    subscription newMessages($convoId: ID!) {
      newMessage(conversationId: $convoId) {
        conversationId
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
    }
  `,
};