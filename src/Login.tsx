import React, { useState, useEffect } from 'react';
import { loginWithGoogle, onAuthChange, setUserRole, getUserRole } from './firebase';
import { User } from 'firebase/auth';

interface LoginProps {
  onLogin: (user: User, role: 'user' | 'admin') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        try {
          const role = await getUserRole(user.uid);
          onLogin(user, role);
        } catch (err) {
          console.error('Error getting user role:', err);
          setError('Failed to get user role');
        }
      }
    });

    return () => unsubscribe();
  }, [onLogin]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginWithGoogle();
      const user = result.user;

      // Set the selected role for the user
      await setUserRole(user.uid, selectedRole);

      onLogin(user, selectedRole);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VoteChain</h1>
          <p className="text-gray-600">Secure Blockchain Voting Platform</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select your role:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedRole('user')}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                selectedRole === 'user'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">👤</div>
              <div className="font-medium">Voter</div>
              <div className="text-sm text-gray-500">Cast your vote</div>
            </button>
            <button
              onClick={() => setSelectedRole('admin')}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                selectedRole === 'admin'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">⚙️</div>
              <div className="font-medium">Admin</div>
              <div className="text-sm text-gray-500">Manage polls</div>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Signing in...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Secure authentication powered by Google</p>
          <p className="mt-1">Your votes are recorded on the blockchain</p>
        </div>
      </div>
    </div>
  );
};

export default Login;