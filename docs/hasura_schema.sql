-- Tables
CREATE TABLE public.chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender text NOT NULL CHECK (sender IN ('user','bot')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX ON public.chats (user_id, created_at DESC);
CREATE INDEX ON public.messages (chat_id, created_at ASC);

-- For Nhost: user_id references auth.users.id logically; Hasura relationship will be set via permissions/session.


