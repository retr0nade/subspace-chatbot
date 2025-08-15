import { gql } from '@apollo/client'

export const LIST_CHATS = gql`
  query MyChats {
    chats(order_by: { created_at: desc }) {
      id
      created_at
    }
  }
`

export const CREATE_CHAT = gql`
  mutation CreateChat {
    insert_chats_one(object: {}) {
      id
    }
  }
`

export const MESSAGES_SUB = gql`
  subscription Messages($chat_id: uuid!) {
    messages(
      where: { chat_id: { _eq: $chat_id } }
      order_by: { created_at: asc }
    ) {
      id
      content
      sender
      created_at
    }
  }
`

export const INSERT_USER_MESSAGE = gql`
  mutation InsertUserMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(
      object: { chat_id: $chat_id, content: $content, sender: "user" }
    ) {
      id
    }
  }
`

export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessage($chat_id: uuid!, $content: String!) {
    sendMessage(chat_id: $chat_id, content: $content) {
      success
      reply
    }
  }
`


