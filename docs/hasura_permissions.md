### Hasura permissions configuration (role: `user`)

Prerequisite: Apply the schema in `docs/hasura_schema.sql` first. In Hasura Console, create the `user` role and configure permissions as below.

### Table: `chats`

- Select
  - Row filter:
    ```json
    { "user_id": { "_eq": "X-Hasura-User-Id" } }
    ```
  - Columns: `id`, `created_at`

- Insert
  - Column presets:
    - `user_id` → from session variable `X-Hasura-User-Id`
  - Input columns required from client: none (client can send empty object)

- Update
  - Recommended: disallow (no columns). If you allow, set row filter:
    ```json
    { "user_id": { "_eq": "X-Hasura-User-Id" } }
    ```
  - Columns: none

- Delete
  - Row filter:
    ```json
    { "user_id": { "_eq": "X-Hasura-User-Id" } }
    ```

### Table: `messages`

- Select
  - Row filter (via relationship to `chats`):
    ```json
    { "chat": { "user_id": { "_eq": "X-Hasura-User-Id" } } }
    ```
  - Columns: `id`, `chat_id`, `sender`, `content`, `created_at`

- Insert
  - Check (enforce ownership and sender is `user`):
    ```json
    { "_and": [
      { "sender": { "_eq": "user" } },
      { "chat": { "user_id": { "_eq": "X-Hasura-User-Id" } } }
    ] }
    ```
  - Column presets: none; client provides `chat_id`, `sender`, `content` (with `sender` = `user`)

- Update / Delete
  - Disallow for simplicity

### Relationships

Create these relationships in Hasura Console:

- `messages.chat` → object relationship on `messages.chat_id` referencing `chats.id`
- `chats.messages` → array relationship on `messages.chat_id` referencing `chats.id`

### JWT / role

- Set default role to `user` in Nhost auth settings.
- Ensure the frontend sends the JWT in the `Authorization: Bearer <token>` header. Optionally include `x-hasura-role: user`.
- Session variables referenced: `X-Hasura-User-Id`.


