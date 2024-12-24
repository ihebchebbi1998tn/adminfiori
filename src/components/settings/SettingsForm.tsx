import React, { useState } from 'react';
import { Lock, MessageCircle } from 'lucide-react';

const SettingsForm = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic
  };

  const handleSupportMessage = () => {
    window.open('https://wa.me/1234567890', '_blank');
  };

  return (
    <div className="space-y-6">
     {/*  <form onSubmit={handlePasswordChange} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-[#5a0c1a]/20">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Current Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded border border-[#5a0c1a]/20 bg-white/50"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 rounded border border-[#5a0c1a]/20 bg-white/50"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded border border-[#5a0c1a]/20 bg-white/50"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#5a0c1a] text-white rounded hover:bg-[#5a0c1a]/90 transition-colors"
          >
            Update Password
          </button>
        </div>
      </form> */}

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-[#5a0c1a]/20">
        <h3 className="text-lg font-semibold mb-4">Support</h3>
        <button
          onClick={handleSupportMessage}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Contact Support via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default SettingsForm;