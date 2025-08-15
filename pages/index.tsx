import Head from 'next/head'
import Link from 'next/link'
import AuthGate from '@/components/AuthGate'
import Header from '@/components/Header'

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
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 dark:from-gray-900 dark:to-black dark:text-gray-100">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Subspace Chatbot</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Next.js 14 + TypeScript + Tailwind CSS, configured for Netlify and Nhost + Apollo.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="https://nextjs.org" className="btn-primary">
                Next.js
              </Link>
              <Link href="https://tailwindcss.com" className="btn-secondary">
                Tailwind
              </Link>
            </div>
          </div>
        </main>
      </AuthGate>
    </>
  )
}


