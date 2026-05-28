import type { Metadata } from 'next'
import { Young_Serif, Inter } from 'next/font/google'
import '../globals.css'
import { Providers } from './providers'

import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

const serif = Young_Serif({
  weight: '400',
  variable: '--font-serif',
  subsets: ['latin-ext'],
})

const sans = Inter({
  variable: '--font-sans',
  subsets: ['latin-ext'],
})

export const metadata: Metadata = {
  title: 'Fuzzi. | QA Heaven',
  description: 'Twoje źródło inspiracji UI ze opruszone szczyptą 3D',
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="bg-background flex min-h-screen flex-col" suppressHydrationWarning>
        <Providers>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}
