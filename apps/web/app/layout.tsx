import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Social Media Agency - White Label Social Management',
  description: 'Professional social media management platform for agencies. Schedule posts, analyze performance, and manage multiple social accounts.',
  keywords: 'social media management, agency, scheduling, analytics, white label',
  authors: [{ name: 'Social Media Agency' }],
  openGraph: {
    type: 'website',
    title: 'Social Media Agency - White Label Social Management',
    description: 'Professional social media management platform for agencies',
    siteName: 'Social Media Agency',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social Media Agency',
    description: 'Professional social media management platform',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
