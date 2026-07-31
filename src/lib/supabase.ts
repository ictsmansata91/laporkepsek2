import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppSettings } from '../types';

let supabaseClient: SupabaseClient | null = null;
let currentUrl = '';
let currentKey = '';

export const getSupabaseClient = (customSettings?: AppSettings): SupabaseClient | null => {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
  const url = customSettings?.supabase_url || metaEnv.VITE_SUPABASE_URL || '';
  const key = customSettings?.supabase_anon_key || metaEnv.VITE_SUPABASE_ANON_KEY || '';

  if (!url || !key || url.trim() === '' || key.trim() === '') {
    return null;
  }

  if (supabaseClient && currentUrl === url && currentKey === key) {
    return supabaseClient;
  }

  try {
    currentUrl = url;
    currentKey = key;
    supabaseClient = createClient(url, key);
    return supabaseClient;
  } catch (error) {
    console.warn('Gagal inisialisasi Supabase client:', error);
    return null;
  }
};

export const resetSupabaseClient = () => {
  supabaseClient = null;
  currentUrl = '';
  currentKey = '';
};

export const SUPABASE_SQL_SCHEMA = `-- SQL Schema untuk Aplikasi LaporKepsek (SMAN 1 Petanahan)
-- Copy & paste seluruh kode ini pada menu SQL Editor di Dashboard Supabase Anda

-- 1. Tabel Guru
CREATE TABLE IF NOT EXISTS public.guru (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  nip TEXT NOT NULL,
  jabatan TEXT DEFAULT 'Guru Pengajar',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel User / Pengguna
CREATE TABLE IF NOT EXISTS public.users_app (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  nama_lengkap TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Laporan Pelanggaran
CREATE TABLE IF NOT EXISTS public.laporan (
  id TEXT PRIMARY KEY,
  no_laporan TEXT NOT NULL,
  tanggal DATE NOT NULL,
  hari TEXT NOT NULL,
  guru_id TEXT,
  nama_guru TEXT NOT NULL,
  nip_guru TEXT NOT NULL,
  masalah TEXT NOT NULL,
  keterangan TEXT NOT NULL,
  pelapor_username TEXT NOT NULL,
  pelapor_nama TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Pengaturan Aplikasi
CREATE TABLE IF NOT EXISTS public.app_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  nama_kepsek TEXT,
  nip_kepsek TEXT,
  nama_sekolah TEXT,
  logo_url TEXT,
  tahun_pelajaran TEXT,
  semester TEXT,
  lokasi_surat TEXT,
  pemerintah_provinsi TEXT,
  dinas_pendidikan TEXT,
  alamat_sekolah TEXT
);

-- Aktifkan RLS dan ijinkan akses anonim (Anon Public Access)
ALTER TABLE public.guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_app ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laporan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon full access guru" ON public.guru FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access users_app" ON public.users_app FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access laporan" ON public.laporan FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access app_settings" ON public.app_settings FOR ALL USING (true) WITH CHECK (true);
`;
