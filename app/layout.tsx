import { Metadata, Viewport } from 'next';
import { ClientShell } from '@/components/ClientShell';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Recipe Manager - Kitchen Kiosk',
  description: 'Multi-tenant professional kitchen recipe management system.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
