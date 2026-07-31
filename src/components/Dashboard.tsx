import React from 'react';
import { 
  Users, 
  FileText, 
  UserCheck, 
  Calendar, 
  PlusCircle, 
  Printer, 
  UploadCloud, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  School
} from 'lucide-react';
import { Guru, UserAccount, Laporan, AppSettings, MenuType } from '../types';

interface DashboardProps {
  guruList: Guru[];
  usersList: UserAccount[];
  laporanList: Laporan[];
  settings: AppSettings;
  setActiveMenu: (menu: MenuType) => void;
  currentUser: UserAccount;
}

export const Dashboard: React.FC<DashboardProps> = ({
  guruList,
  usersList,
  laporanList,
  settings,
  setActiveMenu,
  currentUser
}) => {
  const recentLaporan = [...laporanList]
    .sort((a, b) => new Date(b.created_at || b.tanggal).getTime() - new Date(a.created_at || a.tanggal).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-blue-100 mb-3 border border-white/20">
            <School className="w-3.5 h-3.5" />
            <span>Sistem Informasi Pelaporan Kepala Sekolah</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            Selamat Datang di <span className="text-amber-300">LaporKepsek</span>
          </h1>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-6">
            Aplikasi resmi pencatatan dan rekapitulasi laporan kedisiplinan serta pelanggaran guru untuk {settings.nama_sekolah}. Dirancang untuk kemudahan administrasi, transparansi, dan kemudahan pencetakan format resmi A4 ber-Kop Surat.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveMenu('laporan')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-400/20 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Laporan Baru</span>
            </button>
            <button
              onClick={() => setActiveMenu('grafik')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Grafik & Rekap</span>
            </button>
            <button
              onClick={() => setActiveMenu('cetak_rekap')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-sm transition border border-white/20 backdrop-blur-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Rekap A4</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Guru */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Guru</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{guruList.length}</span>
            <button 
              onClick={() => setActiveMenu('guru')} 
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              Kelola Guru <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">Terdaftar di database sekolah</p>
        </div>

        {/* Total Laporan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Laporan</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{laporanList.length}</span>
            <button 
              onClick={() => setActiveMenu('laporan')} 
              className="text-xs text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1"
            >
              Lihat Laporan <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">Catatan pelanggaran tercatat</p>
        </div>

        {/* Total User / Admin */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pengguna Sistem</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{usersList.length}</span>
            <button 
              onClick={() => setActiveMenu('user')} 
              className="text-xs text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1"
            >
              Kelola User <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">User pelapor & admin aktif</p>
        </div>

        {/* Tahun Pelajaran */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tahun Pelajaran</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{settings.tahun_pelajaran}</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md">
              Semester {settings.semester}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 truncate">Kepsek: {settings.nama_kepsek}</p>
        </div>
      </div>

      {/* Grid Informasi Fitur & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Panduan Penggunaan Aplikasi */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
            <Info className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Alur Penggunaan Aplikasi LaporKepsek</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                1
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Unggah / Input Data Guru</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Masukkan data guru secara manual atau upload sekaligus menggunakan berkas CSV template pada menu <strong>Unggah Guru</strong>.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                2
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Manajemen User Pelapor</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Admin dapat membuat akun user pelapor (Piket, BK, Waka, dsb) beserta username & password di menu <strong>Menu User</strong>.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                3
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Buat Laporan Pelanggaran</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Pilih guru yang dilaporkan, hari & tanggal otomatis terisi, uraikan masalah dan keterangan kronologi pada menu <strong>Laporan</strong>.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                4
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Cetak Laporan Format A4 Resmi</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Cetak rekapitulasi laporan lengkap dengan Kop Surat resmi Jawa Tengah & SMAN 1 Petanahan serta kolom tanda tangan Kepala Sekolah.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-semibold block mb-0.5">Penyimpanan Supabase & Lokal:</span>
              Aplikasi ini mendukung penyimpanan otomatis ke <strong>Supabase Cloud Database</strong> maupun penyimpanan lokal offline browser. Pengaturan nama sekolah, nama Kepala Sekolah, NIP, dan logo sekolah dapat disesuaikan pada menu <strong>Pengaturan</strong>.
            </div>
          </div>
        </div>

        {/* Right Column: Laporan Terbaru */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" /> Laporan Terbaru
              </h2>
              <button 
                onClick={() => setActiveMenu('laporan')}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Lihat Semua
              </button>
            </div>

            {recentLaporan.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm">Belum ada laporan pelanggaran yang dibuat.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLaporan.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 hover:bg-blue-50/40 transition">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-mono font-bold text-blue-600">{item.no_laporan}</span>
                      <span>{item.hari}, {item.tanggal}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm truncate">{item.nama_guru}</h4>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{item.masalah}</p>
                    <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Pelapor: {item.pelapor_nama}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => setActiveMenu('cetak')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl flex items-center justify-center space-x-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Buka Pratinjau Cetak A4</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
