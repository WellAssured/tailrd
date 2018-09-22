export default {
  newMessage: `
    subscription newMessages($convoId: ID!) {
      newMessage(conversationId: $convoId) {
        conversationId
        sender
        timestamp
        content
      }
    }
  `,
};