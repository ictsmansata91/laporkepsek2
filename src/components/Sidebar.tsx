import React from 'react';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  FileText, 
  Printer, 
  Settings, 
  LogOut,
  ShieldCheck,
  School,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { MenuType, UserAccount, AppSettings } from '../types';

interface SidebarProps {
  activeMenu: MenuType;
  setActiveMenu: (menu: MenuType) => void;
  currentUser: UserAccount;
  settings: AppSettings;
  onOpenLoginModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  setActiveMenu,
  currentUser,
  settings,
  onOpenLoginModal
}) => {
  const navItems: { id: MenuType; label: string; icon: React.ReactNode; desc: string; adminOnly?: boolean }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      desc: 'Ringkasan & Informasi App'
    },
    {
      id: 'guru',
      label: 'Unggah Guru',
      icon: <UserCheck className="w-5 h-5" />,
      desc: 'Manual & Upload CSV Guru'
    },
    {
      id: 'user',
      label: 'Menu User',
      icon: <Users className="w-5 h-5" />,
      desc: 'Kelola User & Password',
      adminOnly: true
    },
    {
      id: 'laporan',
      label: 'Laporan',
      icon: <FileText className="w-5 h-5" />,
      desc: 'Input & List Laporan Guru'
    },
    {
      id: 'grafik',
      label: 'Grafik & Rekap',
      icon: <TrendingUp className="w-5 h-5" />,
      desc: 'Grafik Line & Rekap Guru'
    },
    {
      id: 'cetak',
      label: 'Cetak Detail',
      icon: <Printer className="w-5 h-5" />,
      desc: 'Laporan Per Kejadian'
    },
    {
      id: 'cetak_rekap',
      label: 'Cetak Rekap',
      icon: <FileSpreadsheet className="w-5 h-5" />,
      desc: 'Cetak Rekapitulasi A4'
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan',
      icon: <Settings className="w-5 h-5" />,
      desc: 'Kepsek, Logo & Supabase'
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-100 flex flex-col justify-between shrink-0 shadow-xl border-r border-slate-800 print:hidden">
      <div>
        {/* Header App Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <School className="w-6 h-6 text-white" />
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              LaporKepsek
            </h1>
            <p className="text-xs text-slate-400 truncate" title={settings.nama_sekolah}>
              {settings.nama_sekolah || 'SMAN 1 PETANAHAN'}
            </p>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              currentUser.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {currentUser.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-100 truncate">{currentUser.nama_lengkap}</p>
              <div className="flex items-center space-x-1 text-xs text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="capitalize text-[11px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onOpenLoginModal}
            title="Ganti User / Login"
            className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 py-2 space-y-1">
          <div className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Menu Utama
          </div>
          {navItems.map((item) => {
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <div>
                    <div className="text-sm leading-tight font-medium">{item.label}</div>
                    <div className={`text-[11px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {item.desc}
                    </div>
                  </div>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-center">
        <p className="text-xs text-slate-400">
          Tapel <span className="text-slate-200 font-semibold">{settings.tahun_pelajaran}</span> ({settings.semester})
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Kepsek: {settings.nama_kepsek}
        </p>
      </div>
    </aside>
  );
};
