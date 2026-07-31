import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  AlertCircle, 
  X, 
  Calendar, 
  UserCheck, 
  RotateCcw,
  ShieldAlert,
  ListFilter
} from 'lucide-react';
import { Laporan, Guru, UserAccount } from '../types';

interface LaporanManagerProps {
  laporanList: Laporan[];
  guruList: Guru[];
  currentUser: UserAccount;
  onAddLaporan: (laporan: Omit<Laporan, 'id'>) => void;
  onUpdateLaporan: (laporan: Laporan) => void;
  onDeleteLaporan: (id: string) => void;
  onClearAllLaporan: () => void;
}

export const LaporanManager: React.FC<LaporanManagerProps> = ({
  laporanList,
  guruList,
  currentUser,
  onAddLaporan,
  onUpdateLaporan,
  onDeleteLaporan,
  onClearAllLaporan
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLaporan, setEditingLaporan] = useState<Laporan | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const getHariIndo = (dateStr: string) => {
    if (!dateStr) return 'Senin';
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Senin' : days[d.getDay()];
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Form State
  const [formData, setFormData] = useState({
    no_laporan: '',
    tanggal: todayStr,
    hari: getHariIndo(todayStr),
    guru_id: '',
    nama_guru: '',
    nip_guru: '',
    masalah: '',
    keterangan: ''
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Generate Auto Number: e.g. LAP-2026-005
  const generateAutoNoLaporan = () => {
    const year = new Date().getFullYear();
    const count = laporanList.length + 1;
    const pad = String(count).padStart(3, '0');
    return `LAP-${year}-${pad}`;
  };

  const handleOpenAddModal = () => {
    const autoNo = generateAutoNoLaporan();
    const defaultGuru = guruList.length > 0 ? guruList[0] : null;

    setEditingLaporan(null);
    setFormData({
      no_laporan: autoNo,
      tanggal: todayStr,
      hari: getHariIndo(todayStr),
      guru_id: defaultGuru ? defaultGuru.id : '',
      nama_guru: defaultGuru ? defaultGuru.nama : '',
      nip_guru: defaultGuru ? defaultGuru.nip : '',
      masalah: '',
      keterangan: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (laporan: Laporan) => {
    setEditingLaporan(laporan);
    setFormData({
      no_laporan: laporan.no_laporan,
      tanggal: laporan.tanggal,
      hari: laporan.hari || getHariIndo(laporan.tanggal),
      guru_id: laporan.guru_id,
      nama_guru: laporan.nama_guru,
      nip_guru: laporan.nip_guru,
      masalah: laporan.masalah,
      keterangan: laporan.keterangan
    });
    setShowAddModal(true);
  };

  const handleTanggalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setFormData({
      ...formData,
      tanggal: newDate,
      hari: getHariIndo(newDate)
    });
  };

  const handleGuruChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const found = guruList.find(g => g.id === selectedId);
    if (found) {
      setFormData({
        ...formData,
        guru_id: found.id,
        nama_guru: found.nama,
        nip_guru: found.nip
      });
    } else {
      setFormData({
        ...formData,
        guru_id: '',
        nama_guru: e.target.value,
        nip_guru: '-'
      });
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_guru.trim() || !formData.masalah.trim()) {
      showToast('error', 'Nama Guru yang dilaporkan dan Masalah wajib diisi!');
      return;
    }

    if (editingLaporan) {
      onUpdateLaporan({
        ...editingLaporan,
        no_laporan: formData.no_laporan,
        tanggal: formData.tanggal,
        hari: formData.hari,
        guru_id: formData.guru_id,
        nama_guru: formData.nama_guru,
        nip_guru: formData.nip_guru,
        masalah: formData.masalah.trim(),
        keterangan: formData.keterangan.trim()
      });
      showToast('success', `Laporan ${formData.no_laporan} berhasil diperbarui.`);
    } else {
      onAddLaporan({
        no_laporan: formData.no_laporan || generateAutoNoLaporan(),
        tanggal: formData.tanggal,
        hari: formData.hari,
        guru_id: formData.guru_id,
        nama_guru: formData.nama_guru,
        nip_guru: formData.nip_guru,
        masalah: formData.masalah.trim(),
        keterangan: formData.keterangan.trim(),
        pelapor_username: currentUser.username,
        pelapor_nama: currentUser.nama_lengkap
      });
      showToast('success', `Laporan pelanggaran ${formData.no_laporan} berhasil dibuat.`);
    }

    setShowAddModal(false);
  };

  const filteredLaporan = laporanList.filter(l => 
    l.no_laporan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.nama_guru.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.nip_guru.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.masalah.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.pelapor_nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="flex items-center space-x-2 text-amber-600 mb-1">
            <FileText className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Menu 4</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Form & Daftar Laporan Pelanggaran Guru</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Setiap user terdaftar dapat membuat, mengedit, atau menghapus laporan kedisiplinan guru.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 transition shadow-md self-start md:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Laporan Baru</span>
        </button>
      </div>

      {/* Table & Filtering */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari no laporan, nama guru, masalah, pelapor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 justify-between sm:justify-end">
            <span>Total Laporan: <strong className="text-slate-900">{laporanList.length}</strong></span>
            {laporanList.length > 0 && (
              <button
                onClick={() => setShowClearAllConfirm(true)}
                className="text-rose-600 hover:text-rose-800 text-xs font-medium ml-4 underline"
              >
                Hapus Keseluruhan Laporan
              </button>
            )}
          </div>
        </div>

        {/* List Laporan Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">No. Laporan</th>
                <th className="py-3 px-4">Hari / Tanggal</th>
                <th className="py-3 px-4">Nama Guru Dilaporkan & NIP</th>
                <th className="py-3 px-4">Masalah Pelanggaran</th>
                <th className="py-3 px-4">Keterangan / Detail</th>
                <th className="py-3 px-4">Pelapor</th>
                <th className="py-3 px-4 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredLaporan.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">Belum ada data laporan yang cocok.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Klik tombol "Buat Laporan Baru" untuk menambah laporan.</p>
                  </td>
                </tr>
              ) : (
                filteredLaporan.map((laporan, index) => (
                  <tr key={laporan.id} className="hover:bg-amber-50/20 transition">
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-700 whitespace-nowrap">
                      {laporan.no_laporan}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{laporan.hari}</div>
                      <div className="text-[11px] text-slate-500">{laporan.tanggal}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{laporan.nama_guru}</div>
                      <div className="text-[11px] text-slate-500 font-mono">NIP: {laporan.nip_guru || '-'}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-xs">
                      {laporan.masalah}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-sm">
                      <p className="line-clamp-2">{laporan.keterangan || '-'}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      <span className="font-medium text-slate-800">{laporan.pelapor_nama}</span>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(laporan)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Perlaporan"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            onDeleteLaporan(laporan.id);
                            showToast('success', `Laporan ${laporan.no_laporan} berhasil dihapus.`);
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus Perlaporan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Laporan */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                {editingLaporan ? 'Edit Laporan Pelanggaran' : 'Buat Laporan Pelanggaran Guru Baru'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* No Laporan & Tanggal/Hari */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    No. Laporan (Otomatis)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.no_laporan}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono font-bold text-amber-700 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Hari & Tanggal Laporan
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      required
                      value={formData.tanggal}
                      onChange={handleTanggalChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      readOnly
                      value={formData.hari}
                      className="w-24 px-2 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Nama Guru List Option */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pilih Nama Guru Yang Dilaporkan <span className="text-rose-500">*</span>
                </label>
                {guruList.length > 0 ? (
                  <select
                    value={formData.guru_id}
                    onChange={handleGuruChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                  >
                    {guruList.map((guru) => (
                      <option key={guru.id} value={guru.id}>
                        {guru.nama} (NIP: {guru.nip})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-rose-50 rounded-xl text-xs text-rose-800 border border-rose-200">
                    Belum ada data guru di sistem. Silakan isi nama guru manual atau unggah data guru di menu <strong>Unggah Guru</strong> terlebih dahulu.
                  </div>
                )}
              </div>

              {/* Input Manual NIP if custom/overridden */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  NIP Guru Dilaporkan
                </label>
                <input
                  type="text"
                  value={formData.nip_guru}
                  onChange={(e) => setFormData({ ...formData, nip_guru: e.target.value })}
                  placeholder="NIP Guru..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Masalah yang dilaporkan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Masalah Yang Dilaporkan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Terlambat masuk kelas, Tidak hadir tanpa keterangan, dsb."
                  value={formData.masalah}
                  onChange={(e) => setFormData({ ...formData, masalah: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                />
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Keterangan / Kronologi Laporan
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan keterangan detail kejadian, waktu, kelas, atau tindak lanjut awal..."
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between border">
                <span>Pelapor Saat Ini:</span>
                <strong className="text-slate-900 font-semibold">{currentUser.nama_lengkap} (@{currentUser.username})</strong>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-md"
                >
                  Simpan Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Clear All Laporan */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-lg mb-2">Hapus Keseluruhan Laporan?</h3>
            <p className="text-xs text-slate-600 mb-6">
              Tindakan ini akan menghapus seluruh catatan ({laporanList.length} laporan) secara permanen dari aplikasi.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowClearAllConfirm(false)}
                className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onClearAllLaporan();
                  setShowClearAllConfirm(false);
                  showToast('success', 'Semua laporan berhasil dihapus.');
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold"
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
