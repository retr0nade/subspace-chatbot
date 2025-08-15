import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'
import { formatDistanceToNow } from 'date-fns'
import { CREATE_CHAT, LIST_CHATS } from '@/src/graphql/ops'

type Chat = {
  id: string
  created_at: string
}

export default function ChatList() {
  const router = useRouter()
  const { data, loading, error, refetch } = useQuery<{ chats: Chat[] }>(LIST_CHATS)
  const [createChat, { loading: creating, error: createError }] = useMutation(CREATE_CHAT, {
    onCompleted: (res) => {
      const id = res?.insert_chats_one?.id
      if (id) router.push(`/chat/${id}`)
    },
  })

  async function handleNewChat() {
    try {
      await createChat()
    } catch {}
  }

  return (
    <div className="flex h-full min-h-[420px] flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-200">Chats</h2>
        <button onClick={handleNewChat} disabled={creating} className="btn-primary">
          {creating ? 'Creating…' : 'New chat'}
        </button>
      </div>

      <div className="rounded-xl border border-gray-200/70 bg-white/80 p-2 dark:border-gray-800 dark:bg-gray-900/60">
        {loading && (
          <ul className="space-y-2 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="h-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
            ))}
          </ul>
        )}

        {error && (
          <div className="p-4 text-sm">
            <p className="text-red-600 dark:text-red-400">Failed to load chats.</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => refetch()} className="btn-secondary">Retry</button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <ul role="list" className="divide-y divide-gray-200/70 dark:divide-gray-800">
            {data?.chats?.length ? (
              data.chats.map((chat) => (
                <li
                  key={chat.id}
                  className="cursor-pointer px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/70"
                  onClick={() => router.push(`/chat/${chat.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">Chat</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(chat.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-3 py-6 text-sm text-gray-500 dark:text-gray-400">No chats yet.</li>
            )}
          </ul>
        )}

        {createError && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            Could not create chat. Please try again.
          </div>
        )}
      </div>
    </div>
  )
}


