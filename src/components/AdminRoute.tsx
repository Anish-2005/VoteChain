import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthChange, getUserRole, ensureAdminByEmail } from '../firebase';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // ensure admin by email if applicable
      await ensureAdminByEmail(user);

      try {
        const role = await getUserRole(user.uid);
        setIsAdmin(role === 'admin');
      } catch (e) {
        console.warn('AdminRoute: failed to get user role', e);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default AdminRoute;
