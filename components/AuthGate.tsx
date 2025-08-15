import { ReactNode, useMemo, useState } from 'react'
import { nhost } from '@/lib/nhost'
import { useUserData } from '@nhost/react'

type AuthGateProps = {
  children: ReactNode
}

export default function AuthGate({ children }: AuthGateProps) {
  const user = useUserData()
  const [activeTab, setActiveTab] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = useMemo(() => Boolean(user), [user])

  async function handleSubmit() {
    setLoading(true)
    setMessage(null)
    setError(null)
    try {
      if (activeTab === 'sign-in') {
        const { error: signInError } = await nhost.auth.signIn({ email, password })
        if (signInError) throw signInError
        setMessage('Signed in successfully')
      } else {
        const { error: signUpError } = await nhost.auth.signUp({ email, password })
        if (signUpError) throw signUpError
        setMessage('Account created. Check your email to verify (if required).')
      }
    } catch (e: any) {
      setError(e?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4 dark:from-gray-950 dark:to-black">
      <div className="card w-full max-w-md">
        <div className="mb-6 flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          <button
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeTab === 'sign-in'
                ? 'bg-white text-gray-900 shadow dark:bg-gray-900 dark:text-white'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            }`}
            onClick={() => setActiveTab('sign-in')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeTab === 'sign-up'
                ? 'bg-white text-gray-900 shadow dark:bg-gray-900 dark:text-white'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            }`}
            onClick={() => setActiveTab('sign-up')}
          >
            Sign Up
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-gray-600 dark:text-gray-300">Email</label>
            <input
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900 focus:ring-0 dark:border-gray-700 dark:bg-transparent dark:focus:border-gray-200"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-gray-600 dark:text-gray-300">Password</label>
            <input
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900 focus:ring-0 dark:border-gray-700 dark:bg-transparent dark:focus:border-gray-200"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {message && <p className="text-sm text-emerald-600 dark:text-emerald-400">{message}</p>}
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full justify-center"
          >
            {loading ? 'Please wait...' : activeTab === 'sign-in' ? 'Sign In' : 'Create account'}
          </button>
        </div>
      </div>
    </div>
  )
}


