import { nhost } from '@/lib/nhost'

export default function Header() {
  const user = nhost.auth.getUser()

  async function handleSignOut() {
    await nhost.auth.signOut()
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200/60 bg-white/70 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="text-sm font-semibold tracking-wide text-gray-900 dark:text-gray-100">
          GraphQL Chatbot
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          {user?.email && <span className="truncate">{user.email}</span>}
          {user && (
            <button onClick={handleSignOut} className="btn-secondary">
              Sign out
            </button>
          )}
        </div>
      </div>
    </header>
  )
}


