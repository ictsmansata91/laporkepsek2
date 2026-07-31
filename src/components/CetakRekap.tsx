import React, { useState } from 'react';
import { Printer, Calendar, Filter, FileText, Download, RotateCcw, ShieldCheck } from 'lucide-react';
import { Laporan, Guru, AppSettings } from '../types';

interface CetakRekapProps {
  laporanList: Laporan[];
  guruList: Guru[];
  settings: AppSettings;
}

export const CetakRekap: React.FC<CetakRekapProps> = ({
  laporanList,
  guruList,
  settings
}) => {
  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterGuru, setFilterGuru] = useState('ALL');
  const [tanggalSurat, setTanggalSurat] = useState(() => {
    const d = new Date();
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  });

  const handlePrint = () => {
    window.print();
  };

  // Filter logic
  const filteredLaporan = laporanList.filter((item) => {
    if (startDate && item.tanggal < startDate) return false;
    if (endDate && item.tanggal > endDate) return false;
    if (filterGuru !== 'ALL' && item.nama_guru !== filterGuru) return false;
    return true;
  });

  // Calculate Rekapitulasi per Guru for the printable document
  const rekapData = guruList.map((g) => {
    const reportsForGuru = filteredLaporan.filter(l => l.nama_guru === g.nama || l.guru_id === g.id);
    const masalahList = Array.from(new Set(reportsForGuru.map(r => r.masalah)));
    return {
      guru: g,
      totalKasus: reportsForGuru.length,
      masalahList,
      lastReportDate: reportsForGuru.length > 0 
        ? reportsForGuru.reduce((latest, r) => r.tanggal > latest ? r.tanggal : latest, reportsForGuru[0].tanggal)
        : '-'
    };
  }).filter(item => {
    if (filterGuru !== 'ALL') {
      return item.guru.nama === filterGuru;
    }
    return true;
  }).sort((a, b) => b.totalKasus - a.totalKasus);

  const totalSemuaLaporan = filteredLaporan.length;

  return (
    <div className="space-y-6">
      {/* Print Control Toolbar - Hidden when printing */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 mb-1">
              <Printer className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Cetak Rekap Pelanggaran Guru</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">Format Cetak Rekapitulasi Pelanggaran Guru (A4)</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Dokumen resmi rekapitulasi akumulasi catatan pelanggaran guru ber-Kop Surat SMAN 1 Petanahan untuk penandatanganan Kepala Sekolah.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition shadow-lg shadow-blue-600/20 active:scale-95 shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF Rekap A4</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Filter Guru
            </label>
            <select
              value={filterGuru}
              onChange={(e) => setFilterGuru(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none"
            >
              <option value="ALL">Semua Guru ({guruList.length} Orang)</option>
              {guruList.map((g) => (
                <option key={g.id} value={g.nama}>{g.nama}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Tanggal Surat/Pengesahan
            </label>
            <input
              type="text"
              value={tanggalSurat}
              onChange={(e) => setTanggalSurat(e.target.value)}
              placeholder="Contoh: 31 Juli 2026"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {(startDate || endDate || filterGuru !== 'ALL') && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Ditemukan <strong>{totalSemuaLaporan}</strong> total kasus dalam filter rekap ini.</span>
            <button
              onClick={() => { setStartDate(''); setEndDate(''); setFilterGuru('ALL'); }}
              className="text-blue-600 hover:underline flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* A4 CANVAS PRINT PREVIEW AREA */}
      <div className="flex justify-center my-4 overflow-x-auto print:m-0 print:p-0">
        <div className="w-[210mm] min-h-[297mm] bg-white text-black p-[18mm] shadow-2xl rounded-none border border-slate-200 print:shadow-none print:border-none print:p-0 print:w-full print:min-h-0 mx-auto font-serif leading-snug">
          
          {/* KOP SURAT RESMI */}
          <div className="flex items-center space-x-4 pb-2 border-b-4 border-black">
            <div className="w-24 h-24 shrink-0 flex items-center justify-center">
              <img 
                src={settings.logo_url || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80'} 
                alt="Logo Sekolah" 
                className="max-h-24 max-w-24 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 text-center font-serif text-black uppercase">
              <div className="text-[13pt] font-bold tracking-wider leading-tight">
                {settings.pemerintah_provinsi || 'PEMERINTAH PROVINSI JAWA TENGAH'}
              </div>
              <div className="text-[12pt] font-bold tracking-wide leading-tight mt-0.5">
                {settings.dinas_pendidikan || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}
              </div>
              <div className="text-[16pt] font-extrabold tracking-widest leading-tight my-1">
                {settings.nama_sekolah || 'SMA NEGERI 1 PETANAHAN'}
              </div>
              <div className="text-[9pt] font-sans font-normal normal-case tracking-normal text-slate-800">
                {settings.alamat_sekolah || 'Jln desa Tresnorejo, Kec. Petanahan, Kab. Kebumen.'}
              </div>
            </div>
          </div>

          <div className="border-b border-black mt-[2px] mb-6"></div>

          {/* JUDUL REKAPITULASI */}
          <div className="text-center mb-6 font-sans">
            <h2 className="text-[14pt] font-bold uppercase underline tracking-wide">
              LAPORAN REKAPITULASI PELANGGARAN DISIPLIN GURU
            </h2>
            <p className="text-[10pt] text-slate-800 mt-1">
              Tahun Pelajaran {settings.tahun_pelajaran} - Semester {settings.semester}
            </p>
            {startDate || endDate ? (
              <p className="text-[9pt] italic text-slate-600 mt-0.5">
                Periode Tanggal: {startDate || 'Awal'} s.d. {endDate || 'Sekarang'}
              </p>
            ) : null}
          </div>

          {/* TABEL REKAPITULASI A4 */}
          <div className="mb-8 font-sans">
            <table className="w-full text-left text-[9.5pt] border-collapse border border-black">
              <thead>
                <tr className="bg-slate-100 border-b border-black text-center font-bold">
                  <th className="border border-black p-2 w-8">NO</th>
                  <th className="border border-black p-2 w-48">NAMA GURU / NIP</th>
                  <th className="border border-black p-2 w-32">JABATAN</th>
                  <th className="border border-black p-2 w-20">JUMLAH KASUS</th>
                  <th className="border border-black p-2">RINCIAN PELANGGARAN</th>
                  <th className="border border-black p-2 w-28">TGL TERAKHIR</th>
                </tr>
              </thead>
              <tbody>
                {rekapData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="border border-black p-6 text-center text-slate-500 italic">
                      Tidak ada data rekapitulasi pelanggaran guru.
                    </td>
                  </tr>
                ) : (
                  rekapData.map((item, index) => (
                    <tr key={index} className="border-b border-black">
                      <td className="border border-black p-2 text-center align-top">{index + 1}</td>
                      <td className="border border-black p-2 align-top">
                        <div className="font-bold">{item.guru.nama}</div>
                        <div className="text-[8.5pt] text-slate-700">NIP. {item.guru.nip || '-'}</div>
                      </td>
                      <td className="border border-black p-2 align-top text-[9pt]">
                        {item.guru.jabatan || 'Guru Pengajar'}
                      </td>
                      <td className="border border-black p-2 text-center align-top font-bold text-[10pt]">
                        {item.totalKasus} Kasus
                      </td>
                      <td className="border border-black p-2 align-top text-[8.5pt]">
                        {item.masalahList.length > 0 ? (
                          <ul className="list-disc list-inside space-y-0.5">
                            {item.masalahList.map((m, idxM) => (
                              <li key={idxM}>{m}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-slate-500 italic">- Tidak ada catatan -</span>
                        )}
                      </td>
                      <td className="border border-black p-2 text-center align-top text-[8.5pt]">
                        {item.lastReportDate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-black">
                  <td colSpan={3} className="border border-black p-2 text-right">TOTAL KESELURUHAN LAPORAN:</td>
                  <td className="border border-black p-2 text-center text-[10pt]">{totalSemuaLaporan} Kasus</td>
                  <td colSpan={2} className="border border-black p-2 text-[8.5pt] italic text-slate-700">
                    Rekapitulasi resmi otomatis dari Sistem LaporKepsek
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* CATATAN REKOMENDASI KEPALA SEKOLAH */}
          <div className="mb-8 font-sans text-[9pt] border border-black p-3 bg-slate-50/50">
            <p className="font-bold uppercase underline mb-1">Catatan / Tindak Lanjut Kepala Sekolah:</p>
            <div className="h-12 border-b border-dashed border-slate-400"></div>
          </div>

          {/* BAGIAN TANDA TANGAN */}
          <div className="flex justify-end font-sans mt-8 text-[11pt] break-inside-avoid">
            <div className="w-72 text-left space-y-1">
              <p>
                {settings.lokasi_surat || 'Petanahan'}, {tanggalSurat}
              </p>
              <p className="font-semibold">
                Kepala {settings.nama_sekolah || 'SMA Negeri 1 Petanahan'},
              </p>
              
              <div className="h-20"></div>

              <div>
                <p className="font-bold underline uppercase">
                  {settings.nama_kepsek || 'Drs. H. Eko Supriyanto, M.Pd.'}
                </p>
                <p className="text-[10pt] font-medium">
                  NIP. {settings.nip_kepsek || '19680512 199403 1 004'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
