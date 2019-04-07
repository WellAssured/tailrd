export default {
  sendText: `
    mutation createTextMessage ($convoId: ID!, $content: String!) {
      sendTextMessage(input: {
        conversationId: $convoId,
        content: $content
      }) {
        __typename
        conversationId
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
  sendPhoto: `
    mutation createPhotoMessage ($convoId: ID!, $key: String!) {
      sendPhotoMessage(input: {
        conversationId: $convoId,
        key: $key
      }) {
        __typename
        conversationId
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
