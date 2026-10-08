import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Learn-2-Hire | End-to-End Career Development & Employment Platform',
  description:
    'Discover career requirements, take baseline assessments, bridge skill gaps with open curricula, build verified projects, prepare for company interview patterns, and apply directly to matching opportunities.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Learn-2-Hire | Learn. Prove. Get Hired.',
    description: 'The end-to-end career intelligence and employment ecosystem.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-brand-cream text-brand-ink selection:bg-brand-orange selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
