import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Onboarding Library Demo',
  description: 'Demo application for @selvklart/onboarding library',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{maxWidth: "1200px", margin: "0 auto", padding: "20px"}}>
          {children}
        </div>
      </body>
    </html>
  );
}
