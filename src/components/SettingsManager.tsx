import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Upload, 
  Database, 
  Check, 
  AlertCircle, 
  X, 
  Copy, 
  RefreshCw, 
  School, 
  UserCheck, 
  Calendar,
  Cloud,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { AppSettings } from '../types';
import { SUPABASE_SQL_SCHEMA } from '../lib/supabase';
import { syncFromSupabase, syncToSupabase } from '../lib/storage';

interface SettingsManagerProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onRefreshAllData: () => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  settings,
  onSaveSettings,
  onRefreshAllData
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveSettings(formData);
    showToast('success', 'Semua Pengaturan Aplikasi LaporKepsek Berhasil Disimpan!');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('error', 'Ukuran foto logo maksimal 2MB!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormData({ ...formData, logo_url: base64 });
      showToast('success', 'Logo sekolah berhasil diunggah.');
    };
    reader.readAsDataURL(file);
  };

  const handleSyncFromCloud = async () => {
    setIsSyncing(true);
    const res = await syncFromSupabase(formData);
    setIsSyncing(false);

    if (res.success) {
      if (res.data) setFormData(res.data.settings);
      onRefreshAllData();
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  };

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    const res = await syncToSupabase(formData);
    setIsSyncing(false);

    if (res.success) {
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
    showToast('success', 'Skrip SQL Schema Supabase berhasil disalin ke clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notification && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-lg transition ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? <Check className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 mb-1">
            <Settings className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Menu 6</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Pengaturan Aplikasi LaporKepsek</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur identitas sekolah, Kepala Sekolah, NIP, logo Kop Surat, dan koneksi database Supabase.
          </p>
        </div>

        <button
          onClick={() => handleSaveAll()}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition shadow-lg shadow-blue-600/20 active:scale-95 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>SIMPAN PENGATURAN</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Data Kepala Sekolah & Sekolah */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Data Kepala Sekolah & Tahun Pelajaran
              </h3>
              <button
                type="button"
                onClick={() => handleSaveAll()}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Kepala Sekolah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama_kepsek}
                  onChange={(e) => setFormData({ ...formData, nama_kepsek: e.target.value })}
                  placeholder="Contoh: Drs. H. Eko Supriyanto, M.Pd."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  NIP Kepala Sekolah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nip_kepsek}
                  onChange={(e) => setFormData({ ...formData, nip_kepsek: e.target.value })}
                  placeholder="Contoh: 19680512 199403 1 004"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tahun Pelajaran <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.tahun_pelajaran}
                  onChange={(e) => setFormData({ ...formData, tahun_pelajaran: e.target.value })}
                  placeholder="Contoh: 2025/2026"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Semester
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kota / Lokasi Penandatanganan Suratan
                </label>
                <input
                  type="text"
                  value={formData.lokasi_surat}
                  onChange={(e) => setFormData({ ...formData, lokasi_surat: e.target.value })}
                  placeholder="Contoh: Petanahan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Kop Surat Resmi Sekolah */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <School className="w-4 h-4 text-indigo-600" />
                Format Kop Surat Resmi SMAN 1 Petanahan
              </h3>
              <button
                type="button"
                onClick={() => handleSaveAll()}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Kop</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Baris 1: Pemerintah Provinsi
                </label>
                <input
                  type="text"
                  value={formData.pemerintah_provinsi}
                  onChange={(e) => setFormData({ ...formData, pemerintah_provinsi: e.target.value })}
                  placeholder="PEMERINTAH PROVINSI JAWA TENGAH"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Baris 2: Dinas Pendidikan
                </label>
                <input
                  type="text"
                  value={formData.dinas_pendidikan}
                  onChange={(e) => setFormData({ ...formData, dinas_pendidikan: e.target.value })}
                  placeholder="DINAS PENDIDIKAN DAN KEBUDAYAAN"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Baris 3: Nama Sekolah
                </label>
                <input
                  type="text"
                  value={formData.nama_sekolah}
                  onChange={(e) => setFormData({ ...formData, nama_sekolah: e.target.value })}
                  placeholder="SMA NEGERI 1 PETANAHAN"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Baris 4: Alamat Jalan & Lokasi Sekolah
                </label>
                <input
                  type="text"
                  value={formData.alamat_sekolah}
                  onChange={(e) => setFormData({ ...formData, alamat_sekolah: e.target.value })}
                  placeholder="Jln desa Tresnorejo, Kec. Petanahan, Kab. Kebumen."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Logo Upload & Supabase Integration */}
        <div className="space-y-6">

          {/* Logo Sekolah Upload Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                Upload Logo Sekolah (Kop Surat)
              </h3>
              <button
                type="button"
                onClick={() => handleSaveAll()}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Simpan
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl">
              {formData.logo_url ? (
                <img 
                  src={formData.logo_url} 
                  alt="Logo Kop Sekolah" 
                  className="h-28 w-28 object-contain mb-3 drop-shadow" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 mb-3">
                  <School className="w-10 h-10" />
                </div>
              )}

              <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl cursor-pointer flex items-center space-x-1.5 transition">
                <Upload className="w-4 h-4" />
                <span>Pilih Foto Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </label>
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Rekomendasi format PNG / JPG rasio 1:1 transparan.
              </p>
            </div>
          </div>

          {/* Supabase Database Connection Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                Koneksi Supabase Database
              </h3>
              <button
                type="button"
                onClick={() => handleSaveAll()}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Simpan
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Hubungkan ke <strong>Supabase Cloud</strong> agar aplikasi LaporKepsek dapat diakses dari mana saja secara real-time.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  value={formData.supabase_url || ''}
                  onChange={(e) => setFormData({ ...formData, supabase_url: e.target.value })}
                  placeholder="https://xyz...supabase.co"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Supabase Anon Key
                </label>
                <input
                  type="password"
                  value={formData.supabase_anon_key || ''}
                  onChange={(e) => setFormData({ ...formData, supabase_anon_key: e.target.value })}
                  placeholder="eyJhbGciOiJIUzI1Ni..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                disabled={isSyncing}
                onClick={handleSyncToCloud}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
              >
                <Cloud className="w-4 h-4" />
                <span>Upload Data Lokal ke Supabase</span>
              </button>

              <button
                type="button"
                disabled={isSyncing}
                onClick={handleSyncFromCloud}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Tarik Data Terbaru dari Supabase</span>
              </button>

              <button
                type="button"
                onClick={handleCopySql}
                className="w-full py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
              >
                <Copy className="w-4 h-4 text-slate-500" />
                <span>{copiedSql ? '✓ DDL Schema Tersalin!' : 'Salin SQL Schema Supabase'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Global Save Action Bar */}
      <div className="p-4 bg-slate-900 rounded-2xl text-white flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <p className="text-xs text-slate-300">
            Pastikan menekan tombol simpan setelah mengubah nama Kepala Sekolah, NIP, atau Kop Surat SMAN 1 Petanahan.
          </p>
        </div>
        <button
          onClick={() => handleSaveAll()}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-blue-600/30 shrink-0"
        >
          SIMPAN SEMUA PENGATURAN
        </button>
      </div>
    </div>
  );
};
