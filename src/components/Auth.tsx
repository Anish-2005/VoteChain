import React, { useEffect, useState } from 'react';
import { loginWithGoogle, logout, onAuthChange, getCurrentUser } from '../firebase';

const Auth: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    setUser(getCurrentUser());
    return () => unsub();
  }, []);

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <div className="text-sm text-gray-700">{user.displayName}</div>
          <button
            onClick={() => logout()}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Sign out
          </button>
        </>
      ) : (
        <button
          onClick={() => loginWithGoogle()}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default Auth;
