import { CommerceStoreProvider } from '@/contexts/storeProvider'
import { UserStoreProvider } from '@/contexts/UserProvider'
import '@/styles/tailwind.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s - Radiant',
    default: 'Radiant - Close every deal',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&amp;display=swap"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="The Radiant Blog"
          href="/blog/feed.xml"
        />
      </head>
      <body className="overflow-x-hidden text-gray-950 antialiased">
        <UserStoreProvider>
          <CommerceStoreProvider>{children}</CommerceStoreProvider>
        </UserStoreProvider>
      </body>
    </html>
  )
}
