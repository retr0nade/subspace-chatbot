import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { NhostProvider } from '@nhost/react'
import { NhostApolloProvider } from '@nhost/react-apollo'
import { nhost } from '@/lib/nhost'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className={inter.className}>
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </NhostApolloProvider>
    </NhostProvider>
  )
}


