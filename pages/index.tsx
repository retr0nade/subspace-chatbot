import Head from 'next/head'
import Link from 'next/link'
import AuthGate from '@/components/AuthGate'
import Header from '@/components/Header'
import ChatList from '@/components/ChatList'

export default function Home() {
  return (
    <>
      <Head>
        <title>Subspace Chatbot</title>
        <meta name="description" content="Next.js + Tailwind + Netlify starter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AuthGate>
        <Header />
        <main className="min-h-screen text-gray-900 dark:text-gray-100">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-3">
            <aside className="md:col-span-1">
              <ChatList />
            </aside>
            <section className="md:col-span-2">
              <div className="flex h-full min-h-[420px] items-center justify-center rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                <div>
                  <h2 className="text-xl font-medium">Select a chat</h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Choose a chat on the left or start a new one.</p>
                  <div className="mt-6">
                    <Link href="#" onClick={(e) => e.preventDefault()} className="btn-primary">New chat</Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </AuthGate>
    </>
  )
}


