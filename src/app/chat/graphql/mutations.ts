export default {
  send: `
    mutation createMessage ($convoId: ID!, $content: String!) {
      sendMessage(input: {
        conversationId: $convoId,
        content: $content
      }) {
        conversationId
        sender
        timestamp
        content
      }
    }
  `,
};
