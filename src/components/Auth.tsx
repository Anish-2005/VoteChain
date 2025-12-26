import React, { useEffect, useState } from 'react';
import { logout, onAuthChange, getCurrentUser } from '../firebase';
import { Link } from 'react-router-dom';

const Auth: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u));
    setUser(getCurrentUser());
    return () => unsub();
  }, []);

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <div className="text-sm font-medium text-neutral-100 light:text-neutral-900">
            {user.displayName}
          </div>
          <button
            onClick={() => logout()}
            className="px-3 py-1 rounded-md border border-neutral-700 bg-neutral-800 text-neutral-100 hover:bg-neutral-700 transition-colors duration-150 light:border-neutral-300 light:bg-white light:text-neutral-900 light:hover:bg-neutral-100"
          >
            Sign out
          </button>
        </>
      ) : (
        <Link
          to="/login"
          className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-150 text-sm"
        >
          Sign in
        </Link>
      )}
    </div>
  );
};

export default Auth;
