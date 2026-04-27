'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/AuthProvider/AuthProvider';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // ❌ Not logged in → login page
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // 🛡️ Role check
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // redirect based on role
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    }
  }, [user, loading, router, pathname, allowedRoles]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }


  if (!user) return null;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;