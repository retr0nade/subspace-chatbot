### Action SDL

```graphql
type SendMessageResponse {
  success: Boolean!
  reply: String
}

type Mutation {
  sendMessage(chat_id: uuid!, content: String!): SendMessageResponse
}
```

### Handler

- **Webhook URL**: `https://<YOUR-N8N-HOST>/webhook/send-message`
- **Forward client headers**: yes
- **Timeout**: 30s
- **Comment**: "Calls n8n workflow which calls OpenRouter and writes bot reply"

### Permissions

- **Only role**: `user`
- **Row check**: none on the action itself; validation occurs in n8n using chat ownership.

### Session variables forwarded by Hasura

- `x-hasura-user-id`
- `x-hasura-role`
- `x-hasura-default-role`


