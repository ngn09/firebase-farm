import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AppShell } from '@/components/shared/app-shell';
import { APP_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.NAME,
    template: `%s | ${APP_CONFIG.NAME}`,
  },
  description: 'Yapay zeka destekli çiftlik yardımcınız.',
  keywords: ['çiftlik', 'tarım', 'hayvancılık', 'yönetim', 'yapay zeka'],
  authors: [{ name: 'Farm Assistant Team' }],
  creator: 'Farm Assistant',
  publisher: 'Farm Assistant',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://farm-assistant.app'),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://farm-assistant.app',
    title: APP_CONFIG.NAME,
    description: 'Yapay zeka destekli çiftlik yardımcınız.',
    siteName: APP_CONFIG.NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_CONFIG.NAME,
    description: 'Yapay zeka destekli çiftlik yardımcınız.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#467546" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}