import React, { useState, useRef } from 'react';
import { 
  UserCheck, 
  Plus, 
  Upload, 
  Download, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  AlertCircle, 
  FileSpreadsheet,
  X,
  UserPlus
} from 'lucide-react';
import Papa from 'papaparse';
import { Guru } from '../types';

interface GuruManagerProps {
  guruList: Guru[];
  onAddGuru: (guru: Omit<Guru, 'id'>) => void;
  onUpdateGuru: (guru: Guru) => void;
  onDeleteGuru: (id: string) => void;
  onBulkAddGuru: (guruList: Omit<Guru, 'id'>[]) => void;
  onClearAllGuru: () => void;
}

export const GuruManager: React.FC<GuruManagerProps> = ({
  guruList,
  onAddGuru,
  onUpdateGuru,
  onDeleteGuru,
  onBulkAddGuru,
  onClearAllGuru
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGuru, setEditingGuru] = useState<Guru | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    nama: '',
    nip: '',
    jabatan: 'Guru Pengajar'
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAddModal = () => {
    setFormData({ nama: '', nip: '', jabatan: 'Guru Pengajar' });
    setEditingGuru(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (guru: Guru) => {
    setEditingGuru(guru);
    setFormData({ nama: guru.nama, nip: guru.nip, jabatan: guru.jabatan || 'Guru Pengajar' });
    setShowAddModal(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.nip.trim()) {
      showToast('error', 'Nama dan NIP guru wajib diisi!');
      return;
    }

    if (editingGuru) {
      onUpdateGuru({
        ...editingGuru,
        nama: formData.nama.trim(),
        nip: formData.nip.trim(),
        jabatan: formData.jabatan.trim()
      });
      showToast('success', `Data guru ${formData.nama} berhasil diperbarui.`);
    } else {
      onAddGuru({
        nama: formData.nama.trim(),
        nip: formData.nip.trim(),
        jabatan: formData.jabatan.trim()
      });
      showToast('success', `Guru ${formData.nama} berhasil ditambahkan.`);
    }

    setShowAddModal(false);
  };

  // CSV Parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedRows = results.data as any[];
        const newGuruItems: Omit<Guru, 'id'>[] = [];

        parsedRows.forEach((row) => {
          const nama = row.nama || row.Nama || row.NAMA || row['Nama Guru'] || row['NAMA GURU'];
          const nip = row.nip || row.Nip || row.NIP || row['NIP Guru'] || row['NIP GURU'];
          const jabatan = row.jabatan || row.Jabatan || row.JABATAN || 'Guru Pengajar';

          if (nama && nip) {
            newGuruItems.push({
              nama: String(nama).trim(),
              nip: String(nip).trim(),
              jabatan: String(jabatan).trim()
            });
          }
        });

        if (newGuruItems.length === 0) {
          showToast('error', 'Format CSV tidak valid atau kolom "nama" dan "nip" tidak ditemukan.');
        } else {
          onBulkAddGuru(newGuruItems);
          showToast('success', `Berhasil mengunggah ${newGuruItems.length} data guru dari berkas CSV!`);
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      error: (err) => {
        showToast('error', `Gagal membaca CSV: ${err.message}`);
      }
    });
  };

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const csvContent = 'nama,nip,jabatan\n"Bambang Setyawan, S.Pd.","19750814 200212 1 003","Guru Matematika"\n"Siti Rahmawati, M.Pd.","19810325 200604 2 011","Guru Bahasa Indonesia"\n"Drs. Agus Wijaya","19691102 199802 1 002","Guru Fisika"';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_unggah_guru_laporkepsek.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredGuru = guruList.filter(g => 
    g.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.jabatan && g.jabatan.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
          <div className="flex items-center space-x-2 text-blue-600 mb-1">
            <UserCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Menu 2</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Kelola Data Guru SMAN 1 Petanahan</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tambah data guru secara manual atau unggah massal melalui file format CSV.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            accept=".csv" 
            className="hidden" 
            onChange={handleFileUpload}
          />

          <button
            onClick={handleDownloadTemplate}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
            title="Unduh Contoh Format Berkas CSV"
          >
            <Download className="w-4 h-4" />
            <span>Template CSV</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Guru Manual</span>
          </button>
        </div>
      </div>

      {/* Table & Controls Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama guru, NIP, atau jabatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 justify-between sm:justify-end">
            <span>Total Guru: <strong className="text-slate-900">{guruList.length}</strong></span>
            {guruList.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-rose-600 hover:text-rose-800 text-xs font-medium ml-4 underline"
              >
                Kosongkan Semua Data Guru
              </button>
            )}
          </div>
        </div>

        {/* Table List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Lengkap Guru</th>
                <th className="py-3 px-4">NIP</th>
                <th className="py-3 px-4">Jabatan / Mengajar</th>
                <th className="py-3 px-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredGuru.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    <UserPlus className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium">Tidak ada data guru yang ditemukan.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Silakan tambah guru manual atau upload via CSV.</p>
                  </td>
                </tr>
              ) : (
                filteredGuru.map((guru, index) => (
                  <tr key={guru.id} className="hover:bg-blue-50/30 transition">
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{guru.nama}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{guru.nip || '-'}</td>
                    <td className="py-3 px-4 text-slate-600">{guru.jabatan || 'Guru Pengajar'}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleOpenEditModal(guru)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Guru"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteGuru(guru.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus Guru"
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

      {/* Modal Add / Edit Guru */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                {editingGuru ? 'Edit Data Guru' : 'Tambah Data Guru Baru'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap Guru <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Drs. Bambang Setyawan, M.Pd."
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  NIP Guru <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 19750814 200212 1 003"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Jabatan / Mata Pelajaran
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Guru Matematika"
                  value={formData.jabatan}
                  onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Clear All */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-lg mb-2">Kosongkan Semua Data Guru?</h3>
            <p className="text-xs text-slate-600 mb-6">
              Tindakan ini akan menghapus seluruh data guru ({guruList.length} orang) dari aplikasi.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onClearAllGuru();
                  setShowClearConfirm(false);
                  showToast('success', 'Semua data guru berhasil dikosongkan.');
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
