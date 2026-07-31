import React, { useState } from 'react';
import { LogIn, KeyRound, User, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { UserAccount } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  usersList: UserAccount[];
  currentUser: UserAccount;
  onSelectUser: (user: UserAccount) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  usersList,
  currentUser,
  onSelectUser
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const found = usersList.find(
      u => u.username.toLowerCase() === usernameInput.trim().toLowerCase()
    );

    if (!found) {
      setErrorMsg('Nama user (username) tidak ditemukan.');
      return;
    }

    if (found.password && found.password !== passwordInput.trim()) {
      setErrorMsg('Password salah! Silakan coba lagi.');
      return;
    }

    onSelectUser(found);
    setUsernameInput('');
    setPasswordInput('');
    onClose();
  };

  const handleQuickSwitch = (user: UserAccount) => {
    onSelectUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <LogIn className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Ganti User / Login LaporKepsek</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 mb-4 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama User (Username)
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Masukkan username..."
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Masukkan password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition"
          >
            Masuk Sebagai User Ini
          </button>
        </form>

        {/* Quick User Switcher */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 mb-2">Pilih Cepat Akun Terdaftar:</p>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {usersList.map((user) => {
              const isCurrent = currentUser.id === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => handleQuickSwitch(user)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition text-xs ${
                    isCurrent
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{user.nama_lengkap}</span>
                      <span className="font-mono text-[10px] text-slate-500">(@{user.username})</span>
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize">Role: {user.role}</div>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] px-2 py-0.5 bg-blue-600 text-white font-bold rounded-full">
                      Aktif
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
