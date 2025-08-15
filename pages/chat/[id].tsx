import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useSubscription } from '@apollo/client'
import { INSERT_USER_MESSAGE, MESSAGES_SUB, SEND_MESSAGE_ACTION } from '@/src/graphql/ops'
import Header from '@/components/Header'
import AuthGate from '@/components/AuthGate'
import { format } from 'date-fns'

type Message = {
  id: string
  content: string
  sender: string
  created_at: string
}

export default function ChatPage() {
  const router = useRouter()
  const chatIdParam = router.query.id
  const chatId = typeof chatIdParam === 'string' ? chatIdParam : ''
  const ready = useMemo(() => typeof chatIdParam === 'string' && chatIdParam.length > 0, [chatIdParam])

  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [awaitingReply, setAwaitingReply] = useState(false)

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const { data, loading, error } = useSubscription<{ messages: Message[] }>(MESSAGES_SUB, {
    skip: !ready,
    variables: { chat_id: chatId },
  })

  const [insertMessage] = useMutation(INSERT_USER_MESSAGE)
  const [sendMessage] = useMutation(SEND_MESSAGE_ACTION)

  useEffect(() => {
    if (error) {
      triggerToast('Live updates disconnected. Retrying…')
    }
  }, [error])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [data?.messages?.length])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [awaitingReply])

  function triggerToast(message: string) {
    setToast(message)
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }

  async function handleSend() {
    const text = content.trim()
    if (!text || !ready || sending) return
    setSending(true)
    try {
      const vars = { chat_id: chatId, content: text }
      await insertMessage({ variables: vars })
      setContent('')
      setSending(false)
      setAwaitingReply(true)
      await sendMessage({ variables: vars })
    } catch (e: any) {
      triggerToast(e?.message || 'Failed to send message')
    } finally {
      setSending(false)
      setAwaitingReply(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  return (
    <AuthGate>
      <Header />
      <main className="flex min-h-screen flex-col text-gray-900 dark:text-gray-100">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-28 pt-6">
          {/* Messages area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto rounded-xl border border-gray-200/70 bg-white/60 p-4 dark:border-gray-800 dark:bg-gray-900/60"
          >
            {!ready && (
              <div className="grid h-full place-items-center text-sm text-gray-500 dark:text-gray-400">Loading…</div>
            )}
            {ready && loading && (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={`flex ${i % 2 ? 'justify-end' : 'justify-start'}`}>
                    <div className="h-6 w-48 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
                  </div>
                ))}
              </div>
            )}
            {ready && !loading && (
              <div className="space-y-3">
                {(() => {
                  const items = data?.messages ?? []
                  let prevDay: string | null = null
                  return (
                    <>
                      {items.map((m) => {
                        const d = new Date(m.created_at)
                        const dayKey = d.toDateString()
                        const showHeader = dayKey !== prevDay
                        prevDay = dayKey
                        return (
                          <Fragment key={m.id}>
                            {showHeader && (
                              <div className="my-2 flex justify-center">
                                <div className="rounded-full border border-gray-200/70 bg-white/70 px-3 py-1 text-xs text-gray-500 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-400">
                                  {format(d, 'PPP')}
                                </div>
                              </div>
                            )}
                            <div className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-soft ${
                                  m.sender === 'user'
                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-black'
                                    : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                                }`}
                              >
                                {m.content}
                              </div>
                            </div>
                          </Fragment>
                        )
                      })}
                      {awaitingReply && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-2xl bg-gray-100 px-4 py-2 text-sm text-gray-900 shadow-soft dark:bg-gray-800 dark:text-gray-100">
                            <span className="inline-flex items-center gap-1">
                              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.2s]" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:0.2s]" />
                            </span>
                          </div>
                        </div>
                      )}
                      {items.length === 0 && !awaitingReply && (
                        <div className="grid h-40 place-items-center text-sm text-gray-500 dark:text-gray-400">
                          No messages yet. Say hello!
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="sticky bottom-0 mt-4 w-full">
            <div className="rounded-2xl border border-gray-200/70 bg-white/90 p-3 shadow backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
              <div className="flex items-end gap-3">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder="Type your message…"
                  className="min-h-[44px] flex-1 resize-none rounded-xl border border-transparent bg-transparent px-3 py-2 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-300 focus:ring-0 dark:focus:border-gray-700"
                />
                <button onClick={handleSend} disabled={!ready || sending || !content.trim()} className="btn-primary">
                  {sending ? 'Sending…' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Toast banner */}
        {toast && (
          <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform">
            <div className="pointer-events-auto rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 shadow dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              {toast}
            </div>
          </div>
        )}
      </main>
    </AuthGate>
  )
}


