export interface Guru {
  id: string;
  nama: string;
  nip: string;
  jabatan?: string;
  created_at?: string;
}

export interface UserAccount {
  id: string;
  username: string;
  nama_lengkap: string;
  password?: string;
  role: 'admin' | 'user';
  created_at?: string;
}

export interface Laporan {
  id: string;
  no_laporan: string; // Otomatis LAP-2026-001
  tanggal: string; // YYYY-MM-DD
  hari: string; // Senin, Selasa, dst.
  guru_id: string;
  nama_guru: string;
  nip_guru: string;
  masalah: string;
  keterangan: string;
  pelapor_username: string;
  pelapor_nama: string;
  created_at?: string;
}

export interface AppSettings {
  nama_kepsek: string;
  nip_kepsek: string;
  nama_sekolah: string;
  logo_url: string;
  tahun_pelajaran: string;
  semester: string;
  lokasi_surat: string;
  pemerintah_provinsi: string;
  dinas_pendidikan: string;
  alamat_sekolah: string;
  supabase_url?: string;
  supabase_anon_key?: string;
}

export type MenuType = 'dashboard' | 'guru' | 'user' | 'laporan' | 'grafik' | 'cetak' | 'cetak_rekap' | 'pengaturan';
