
import { Toaster } from 'react-hot-toast';
import './globals.css';
import AuthProvider from '@/AuthProvider/AuthProvider';

export const metadata = {
  title: 'Auth App',
  description: 'Authentication with Express and Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}