import React, { useState } from 'react';
import { Package, Lock, Mail } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@fiori.com' && password === 'fiori2025') {
      onLogin();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5a0c1a]/5 via-[#f4f4f4] to-[#5a0c1a]/5 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#5a0c1a]/10 p-3 rounded-full mb-4">
            <Package className="w-8 h-8 text-[#5a0c1a]" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#5a0c1a] to-[#5a0c1a]/70 bg-clip-text text-transparent">
            Fiori Admin
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a0c1a]/20 focus:border-[#5a0c1a]"
                placeholder="admin@fiori.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5a0c1a]/20 focus:border-[#5a0c1a]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#5a0c1a] text-white py-2 rounded-lg hover:bg-[#5a0c1a]/90 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;