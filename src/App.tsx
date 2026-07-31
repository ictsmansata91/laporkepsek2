import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { GuruManager } from './components/GuruManager';
import { UserManager } from './components/UserManager';
import { LaporanManager } from './components/LaporanManager';
import { GrafikRekap } from './components/GrafikRekap';
import { CetakLaporan } from './components/CetakLaporan';
import { CetakRekap } from './components/CetakRekap';
import { SettingsManager } from './components/SettingsManager';
import { LoginModal } from './components/LoginModal';
import { MenuType, Guru, UserAccount, Laporan, AppSettings } from './types';
import { 
  getStoredGuru, saveStoredGuru,
  getStoredUsers, saveStoredUsers,
  getStoredLaporan, saveStoredLaporan,
  getStoredSettings, saveStoredSettings,
  getActiveUserSession, setActiveUserSession,
  syncFromSupabase, syncToSupabase
} from './lib/storage';
import { Menu, X, School, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeMenu, setActiveMenu] = useState<MenuType>('dashboard');
  const [guruList, setGuruList] = useState<Guru[]>(() => getStoredGuru());
  const [usersList, setUsersList] = useState<UserAccount[]>(() => getStoredUsers());
  const [laporanList, setLaporanList] = useState<Laporan[]>(() => getStoredLaporan());
  const [settings, setSettings] = useState<AppSettings>(() => getStoredSettings());
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => getActiveUserSession());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-sync with Supabase on mount if configured
  useEffect(() => {
    if (settings.supabase_url && settings.supabase_anon_key) {
      syncFromSupabase(settings).then(res => {
        if (res.success && res.data) {
          setGuruList(res.data.guru);
          setUsersList(res.data.users);
          setLaporanList(res.data.laporan);
          setSettings(res.data.settings);
        }
      });
    }
  }, []);

  const refreshAllFromStorage = () => {
    setGuruList(getStoredGuru());
    setUsersList(getStoredUsers());
    setLaporanList(getStoredLaporan());
    setSettings(getStoredSettings());
  };

  // Guru CRUD
  const handleAddGuru = (newGuru: Omit<Guru, 'id'>) => {
    const item: Guru = { ...newGuru, id: 'g-' + Date.now() };
    const updated = [item, ...guruList];
    setGuruList(updated);
    saveStoredGuru(updated);
    if (settings.supabase_url) syncToSupabase(settings);
  };

  const handleUpdateGuru = (updatedGuru: Guru) => {
    const updated = guruList.map(g => g.id === updatedGuru.id ? updatedGuru : g);
    setGuruList(updated);
    saveStoredGuru(updated);
    if (settings.supabase_url) syncToSupabase(settings);
  };

  const handleDeleteGuru = (id: string) => {
    const updated = guruList.filter(g => g.id !== id);
    setGuruList(updated);
    saveStoredGuru(updated);
    if (settings.supabase_url) syncToSupabase(settings);
  };

  const handleBulkAddGuru = (items: Omit<Guru, 'id'>[]) => {
    const newItems: Guru[] = items.map((it, idx) => ({ ...it, id: `g-${Date.now()}-${idx}` }));
    const updated = [...newItems, ...guruList];
    setGuruList(updated);
    saveStoredGuru(updated);
    if (settings.supabase_url) syncToSupabase(settings);
  };

  const handleClearAllGuru = () => {
    setGuruList([]);
    saveStoredGuru([]);
    if (settings.supabase_url) syncToSupabase(settings);
  };

  // Users CRUD
  const handleAddUser = (newUser: Omit<UserAccount, 'id'>) => {
    const item: UserAccount = { ...newUser, id: 'u-' + Date.now() };
    const updated = [...usersList, item];
    setUsersList(updated);
    saveStoredUsers(updated);
    if (settings.supabase_url) syncToSupabase(settings);
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    const updated = usersList.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsersList(updated);
    saveStoredUsers(updated);
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      setActiveUserSession(updatedUser);
    }
    if (settings.supabase_url) syncToSupabase(settings);
  };

  const handleDeleteUser = (id: string) => {
    const updated = usersList.filter(u => u.id !== id);
    setUsersList(updated);
    saveStoredUsers(updated);
    if (settings.supabase_url) syncToSupabase(settings);
  };

  // Laporan CRUD
  const handleAddLaporan = (newLaporan: Omit<Laporan, 'id'>) => {
    const item: Laporan = { ...newLaporan, id: 'lap-' + Date.now(), created_at: new Date().toISOString() };
    const updated = [item, ...laporanList];
    setLaporanList(updated);
    saveStoredLaporan(updated);
    if (settings.supabase_url) syncToSupabase(settings);
  };

  const handleUpdateLaporan = (updatedLaporan: Laporan) => {
    const updated = laporanList.map(l => l.id === updatedLaporan.id ? updatedLaporan : l);
    setLaporanList(updated);
    saveStoredLaporan(updated);
    if (settings.supabase_url) syncToSupabase(settings);
  };

  const handleDeleteLaporan = (id: string) => {
    const updated = laporanList.filter(l => l.id !== id);
    setLaporanList(updated);
    saveStoredLaporan(updated);
    if (settings.supabase_url) syncToSupabase(settings);
  };

  const handleClearAllLaporan = () => {
    setLaporanList([]);
    saveStoredLaporan([]);
    if (settings.supabase_url) syncToSupabase(settings);
  };

  // Settings
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    if (newSettings.supabase_url) syncToSupabase(newSettings);
  };

  // Switch User Session
  const handleSelectUser = (user: UserAccount) => {
    setCurrentUser(user);
    setActiveUserSession(user);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Mobile Top Navigation Bar */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40 print:hidden shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">LaporKepsek</h1>
            <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{settings.nama_sekolah}</p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-slate-800 rounded-xl text-slate-200 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 pt-16 print:hidden">
          <div className="p-4">
            <Sidebar
              activeMenu={activeMenu}
              setActiveMenu={(menu) => {
                setActiveMenu(menu);
                setMobileMenuOpen(false);
              }}
              currentUser={currentUser}
              settings={settings}
              onOpenLoginModal={() => {
                setShowLoginModal(true);
                setMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          currentUser={currentUser}
          settings={settings}
          onOpenLoginModal={() => setShowLoginModal(true)}
        />
      </div>

      {/* Main View Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {activeMenu === 'dashboard' && (
          <Dashboard
            guruList={guruList}
            usersList={usersList}
            laporanList={laporanList}
            settings={settings}
            setActiveMenu={setActiveMenu}
            currentUser={currentUser}
          />
        )}

        {activeMenu === 'guru' && (
          <GuruManager
            guruList={guruList}
            onAddGuru={handleAddGuru}
            onUpdateGuru={handleUpdateGuru}
            onDeleteGuru={handleDeleteGuru}
            onBulkAddGuru={handleBulkAddGuru}
            onClearAllGuru={handleClearAllGuru}
          />
        )}

        {activeMenu === 'user' && (
          <UserManager
            usersList={usersList}
            currentUser={currentUser}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {activeMenu === 'laporan' && (
          <LaporanManager
            laporanList={laporanList}
            guruList={guruList}
            currentUser={currentUser}
            onAddLaporan={handleAddLaporan}
            onUpdateLaporan={handleUpdateLaporan}
            onDeleteLaporan={handleDeleteLaporan}
            onClearAllLaporan={handleClearAllLaporan}
          />
        )}

        {activeMenu === 'grafik' && (
          <GrafikRekap
            laporanList={laporanList}
            guruList={guruList}
            settings={settings}
            setActiveMenu={setActiveMenu}
          />
        )}

        {activeMenu === 'cetak' && (
          <CetakLaporan
            laporanList={laporanList}
            settings={settings}
          />
        )}

        {activeMenu === 'cetak_rekap' && (
          <CetakRekap
            laporanList={laporanList}
            guruList={guruList}
            settings={settings}
          />
        )}

        {activeMenu === 'pengaturan' && (
          <SettingsManager
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onRefreshAllData={refreshAllFromStorage}
          />
        )}
      </main>

      {/* User Login & Switcher Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        usersList={usersList}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
}
