import { Guru, UserAccount, Laporan, AppSettings } from '../types';
import { getSupabaseClient } from './supabase';

export const DEFAULT_SETTINGS: AppSettings = {
  nama_kepsek: 'Drs. H. Eko Supriyanto, M.Pd.',
  nip_kepsek: '19680512 199403 1 004',
  nama_sekolah: 'SMA NEGERI 1 PETANAHAN',
  logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80', // Logo Lambang Pendidikan/Sekolah
  tahun_pelajaran: '2025/2026',
  semester: 'Ganjil',
  lokasi_surat: 'Petanahan',
  pemerintah_provinsi: 'PEMERINTAH PROVINSI JAWA TENGAH',
  dinas_pendidikan: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
  alamat_sekolah: 'Jln desa Tresnorejo, Kec. Petanahan, Kab. Kebumen.',
  supabase_url: '',
  supabase_anon_key: '',
};

export const INITIAL_GURU: Guru[] = [
  { id: 'g-1', nama: 'Bambang Setyawan, S.Pd.', nip: '19750814 200212 1 003', jabatan: 'Guru Matematika' },
  { id: 'g-2', nama: 'Siti Rahmawati, M.Pd.', nip: '19810325 200604 2 011', jabatan: 'Guru Bahasa Indonesia' },
  { id: 'g-3', nama: 'Drs. Agus Wijaya', nip: '19691102 199802 1 002', jabatan: 'Guru Fisika' },
  { id: 'g-4', nama: 'Nur Hidayah, S.Si.', nip: '19850619 201001 2 018', jabatan: 'Guru Biologi' },
  { id: 'g-5', nama: 'Tri Suhartono, S.Kom.', nip: '19881204 201503 1 007', jabatan: 'Guru Informatika' },
  { id: 'g-6', nama: 'Sri Lestari, S.Pd.', nip: '19820710 200902 2 005', jabatan: 'Guru Bahasa Inggris' },
  { id: 'g-7', nama: 'Hendra Gunawan, S.Pd.', nip: '19900215 201903 1 009', jabatan: 'Guru PJOK' }
];

export const INITIAL_USERS: UserAccount[] = [
  { id: 'u-admin', username: 'admin', nama_lengkap: 'Administrator Sekolah', password: 'admin', role: 'admin' },
  { id: 'u-bk', username: 'gurubk', nama_lengkap: 'Siti Kholifah, S.Psi. (Guru BK)', password: '123', role: 'user' },
  { id: 'u-pikett', username: 'gurupiket', nama_lengkap: 'Ahmad Fauzi, S.Pd. (Piket)', password: '123', role: 'user' },
  { id: 'u-wakatek', username: 'waka_kesiswaan', nama_lengkap: 'Drs. Budi Santoso, M.Si.', password: '123', role: 'user' },
];

export const INITIAL_LAPORAN: Laporan[] = [
  {
    id: 'lap-1',
    no_laporan: 'LAP-2026-001',
    tanggal: '2026-02-10',
    hari: 'Selasa',
    guru_id: 'g-1',
    nama_guru: 'Bambang Setyawan, S.Pd.',
    nip_guru: '19750814 200212 1 003',
    masalah: 'Terlambat Masuk Kelas (20 Menit)',
    keterangan: 'Hadir terlambat pada jam pelajaran ke-1.',
    pelapor_username: 'gurupiket',
    pelapor_nama: 'Ahmad Fauzi, S.Pd. (Piket)',
    created_at: new Date('2026-02-10T07:25:00').toISOString()
  },
  {
    id: 'lap-2',
    no_laporan: 'LAP-2026-002',
    tanggal: '2026-03-15',
    hari: 'Minggu',
    guru_id: 'g-7',
    nama_guru: 'Hendra Gunawan, S.Pd.',
    nip_guru: '19900215 201903 1 009',
    masalah: 'Tidak Hadir Tanpa Keterangan (Alpha)',
    keterangan: 'Tidak mengisi daftar hadir KBM dan tidak ada surat izin.',
    pelapor_username: 'gurupiket',
    pelapor_nama: 'Ahmad Fauzi, S.Pd. (Piket)',
    created_at: new Date('2026-03-15T08:00:00').toISOString()
  },
  {
    id: 'lap-3',
    no_laporan: 'LAP-2026-003',
    tanggal: '2026-04-22',
    hari: 'Rabu',
    guru_id: 'g-3',
    nama_guru: 'Drs. Agus Wijaya',
    nip_guru: '19691102 199802 1 002',
    masalah: 'Meninggalkan Kelas Lebih Awal',
    keterangan: 'Kelas ditinggal 45 menit sebelum bel berbunyi.',
    pelapor_username: 'gurubk',
    pelapor_nama: 'Siti Kholifah, S.Psi. (Guru BK)',
    created_at: new Date('2026-04-22T11:15:00').toISOString()
  },
  {
    id: 'lap-4',
    no_laporan: 'LAP-2026-004',
    tanggal: '2026-05-18',
    hari: 'Senin',
    guru_id: 'g-1',
    nama_guru: 'Bambang Setyawan, S.Pd.',
    nip_guru: '19750814 200212 1 003',
    masalah: 'Tidak Mengisi Jurnal KBM',
    keterangan: 'Jurnal KBM kelas XII MIPA 1 kosong selama dua kali tatap muka.',
    pelapor_username: 'waka_kesiswaan',
    pelapor_nama: 'Drs. Budi Santoso, M.Si.',
    created_at: new Date('2026-05-18T14:00:00').toISOString()
  },
  {
    id: 'lap-5',
    no_laporan: 'LAP-2026-005',
    tanggal: '2026-06-12',
    hari: 'Jumat',
    guru_id: 'g-5',
    nama_guru: 'Tri Suhartono, S.Kom.',
    nip_guru: '19881204 201503 1 007',
    masalah: 'Terlambat Mengumpulkan Nilai Evaluasi',
    keterangan: 'Terlambat 3 hari dari tenggat waktu penyerahan nilai akhir semester.',
    pelapor_username: 'waka_kesiswaan',
    pelapor_nama: 'Drs. Budi Santoso, M.Si.',
    created_at: new Date('2026-06-12T09:30:00').toISOString()
  },
  {
    id: 'lap-6',
    no_laporan: 'LAP-2026-006',
    tanggal: '2026-07-28',
    hari: 'Selasa',
    guru_id: 'g-1',
    nama_guru: 'Bambang Setyawan, S.Pd.',
    nip_guru: '19750814 200212 1 003',
    masalah: 'Terlambat Masuk Kelas Jam Pertama (30 Menit)',
    keterangan: 'Jam pelajaran ke-1 Dimulai pukul 07.00 WIB, namun baru hadir di kelas pukul 07.30 WIB tanpa konfirmasi piket.',
    pelapor_username: 'gurupiket',
    pelapor_nama: 'Ahmad Fauzi, S.Pd. (Piket)',
    created_at: new Date('2026-07-28T07:35:00').toISOString()
  },
  {
    id: 'lap-7',
    no_laporan: 'LAP-2026-007',
    tanggal: '2026-07-30',
    hari: 'Kamis',
    guru_id: 'g-3',
    nama_guru: 'Drs. Agus Wijaya',
    nip_guru: '19691102 199802 1 002',
    masalah: 'Meninggalkan Kelas Sebelum Jam Pelajaran Selesai',
    keterangan: 'Mengakhiri KBM di kelas XI MIPA 2 pukul 11.15 WIB padahal jadwal sampai pukul 12.00 WIB.',
    pelapor_username: 'gurubk',
    pelapor_nama: 'Siti Kholifah, S.Psi. (Guru BK)',
    created_at: new Date('2026-07-30T11:20:00').toISOString()
  }
];

// Helper LocalStorage Keys
const KEY_GURU = 'laporkepsek_guru';
const KEY_USERS = 'laporkepsek_users';
const KEY_LAPORAN = 'laporkepsek_laporan';
const KEY_SETTINGS = 'laporkepsek_settings';
const KEY_ACTIVE_USER = 'laporkepsek_active_user';

// Getters
export const getStoredSettings = (): AppSettings => {
  const data = localStorage.getItem(KEY_SETTINGS);
  if (!data) {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings: AppSettings) => {
  localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
};

export const getStoredGuru = (): Guru[] => {
  const data = localStorage.getItem(KEY_GURU);
  if (!data) {
    localStorage.setItem(KEY_GURU, JSON.stringify(INITIAL_GURU));
    return INITIAL_GURU;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_GURU;
  }
};

export const saveStoredGuru = (guruList: Guru[]) => {
  localStorage.setItem(KEY_GURU, JSON.stringify(guruList));
};

export const getStoredUsers = (): UserAccount[] => {
  const data = localStorage.getItem(KEY_USERS);
  if (!data) {
    localStorage.setItem(KEY_USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_USERS;
  }
};

export const saveStoredUsers = (users: UserAccount[]) => {
  localStorage.setItem(KEY_USERS, JSON.stringify(users));
};

export const getStoredLaporan = (): Laporan[] => {
  const data = localStorage.getItem(KEY_LAPORAN);
  if (!data) {
    localStorage.setItem(KEY_LAPORAN, JSON.stringify(INITIAL_LAPORAN));
    return INITIAL_LAPORAN;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_LAPORAN;
  }
};

export const saveStoredLaporan = (laporanList: Laporan[]) => {
  localStorage.setItem(KEY_LAPORAN, JSON.stringify(laporanList));
};

export const getActiveUserSession = (): UserAccount => {
  const data = localStorage.getItem(KEY_ACTIVE_USER);
  if (!data) {
    const admin = INITIAL_USERS[0];
    localStorage.setItem(KEY_ACTIVE_USER, JSON.stringify(admin));
    return admin;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_USERS[0];
  }
};

export const setActiveUserSession = (user: UserAccount) => {
  localStorage.setItem(KEY_ACTIVE_USER, JSON.stringify(user));
};

// Supabase Sync logic
export const syncFromSupabase = async (settings: AppSettings): Promise<{
  success: boolean;
  message: string;
  data?: { guru: Guru[]; users: UserAccount[]; laporan: Laporan[]; settings: AppSettings };
}> => {
  const supabase = getSupabaseClient(settings);
  if (!supabase) {
    return { success: false, message: 'Supabase URL atau Anon Key belum dikonfigurasi.' };
  }

  try {
    const [guruRes, usersRes, lapRes, settRes] = await Promise.all([
      supabase.from('guru').select('*'),
      supabase.from('users_app').select('*'),
      supabase.from('laporan').select('*'),
      supabase.from('app_settings').select('*').eq('id', 1).single()
    ]);

    let updatedGuru = getStoredGuru();
    let updatedUsers = getStoredUsers();
    let updatedLaporan = getStoredLaporan();
    let updatedSettings = settings;

    if (!guruRes.error && guruRes.data && guruRes.data.length > 0) {
      updatedGuru = guruRes.data;
      saveStoredGuru(updatedGuru);
    }

    if (!usersRes.error && usersRes.data && usersRes.data.length > 0) {
      updatedUsers = usersRes.data;
      saveStoredUsers(updatedUsers);
    }

    if (!lapRes.error && lapRes.data && lapRes.data.length > 0) {
      updatedLaporan = lapRes.data;
      saveStoredLaporan(updatedLaporan);
    }

    if (!settRes.error && settRes.data) {
      updatedSettings = { ...settings, ...settRes.data };
      saveStoredSettings(updatedSettings);
    }

    return {
      success: true,
      message: 'Berhasil menyinkronkan data terbaru dari Supabase!',
      data: { guru: updatedGuru, users: updatedUsers, laporan: updatedLaporan, settings: updatedSettings }
    };
  } catch (err: any) {
    return { success: false, message: `Gagal terhubung ke Supabase: ${err.message || 'Error jaringan'}` };
  }
};

export const syncToSupabase = async (settings: AppSettings): Promise<{ success: boolean; message: string }> => {
  const supabase = getSupabaseClient(settings);
  if (!supabase) {
    return { success: false, message: 'Supabase URL atau Anon Key belum diatur.' };
  }

  try {
    const guru = getStoredGuru();
    const users = getStoredUsers();
    const laporan = getStoredLaporan();

    if (guru.length > 0) {
      await supabase.from('guru').upsert(guru, { onConflict: 'id' });
    }
    if (users.length > 0) {
      await supabase.from('users_app').upsert(users, { onConflict: 'id' });
    }
    if (laporan.length > 0) {
      await supabase.from('laporan').upsert(laporan, { onConflict: 'id' });
    }

    const { supabase_url, supabase_anon_key, ...settToStore } = settings;
    await supabase.from('app_settings').upsert({ id: 1, ...settToStore }, { onConflict: 'id' });

    return { success: true, message: 'Semua data lokal berhasil diunggah/disinkronkan ke Supabase Database!' };
  } catch (err: any) {
    return { success: false, message: `Gagal upload ke Supabase: ${err.message || 'Error'}` };
  }
};
