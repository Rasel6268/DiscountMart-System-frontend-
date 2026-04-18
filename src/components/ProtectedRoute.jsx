'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/Hooks/useAuth';

const ProtectedRoute = ({ children, fallbackPath = '/user/login' }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in → go login
        const redirectPath =
          pathname !== '/auth/login' ? pathname : '/dashboard';

        sessionStorage.setItem('redirectPath', redirectPath);

        router.push(
          `${fallbackPath}?redirect=${encodeURIComponent(redirectPath)}`
        );
      } else {
        // ✅ If logged in → check role
        if (user.role === 'admin' && !pathname.startsWith('/admin')) {
          router.push('/dashboard');
        }

        if (user.role === 'user' && pathname.startsWith('/admin')) {
          router.push('/dashboard');
        }
      }
    }
  }, [user, loading, router, pathname, fallbackPath]);

  // 🔄 Loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ✅ Allow rendering if authorized
  if (user) {
    // prevent wrong role access
    if (user.role === 'admin' || user.role === 'user') {
      return children;
    }
  }

  return null;
};

export default ProtectedRoute;