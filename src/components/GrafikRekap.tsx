import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  AlertTriangle, 
  Calendar, 
  Filter, 
  FileSpreadsheet, 
  Printer, 
  ArrowUpRight,
  ChevronRight,
  Search,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import { Laporan, Guru, AppSettings, MenuType } from '../types';

interface GrafikRekapProps {
  laporanList: Laporan[];
  guruList: Guru[];
  settings: AppSettings;
  setActiveMenu: (menu: MenuType) => void;
}

export const GrafikRekap: React.FC<GrafikRekapProps> = ({
  laporanList,
  guruList,
  settings,
  setActiveMenu
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedGuru, setSelectedGuru] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [chartMode, setChartMode] = useState<'monthly' | 'daily'>('monthly');

  // Filter laporan based on year and teacher
  const filteredLaporan = useMemo(() => {
    return laporanList.filter(lap => {
      const year = lap.tanggal ? lap.tanggal.substring(0, 4) : '2026';
      const matchYear = selectedYear === 'ALL' || year === selectedYear;
      const matchGuru = selectedGuru === 'ALL' || lap.nama_guru === selectedGuru || lap.guru_id === selectedGuru;
      return matchYear && matchGuru;
    });
  }, [laporanList, selectedYear, selectedGuru]);

  // Extract available years
  const availableYears = useMemo(() => {
    const years = new Set(laporanList.map(l => l.tanggal ? l.tanggal.substring(0, 4) : '2026'));
    if (!years.has('2026')) years.add('2026');
    return Array.from(years).sort().reverse();
  }, [laporanList]);

  // Prepare monthly line chart data
  const monthlyChartData = useMemo(() => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
      'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    const monthCounts: Record<number, number> = {};
    for (let i = 0; i < 12; i++) monthCounts[i] = 0;

    filteredLaporan.forEach(lap => {
      if (lap.tanggal) {
        const monthIndex = parseInt(lap.tanggal.substring(5, 7), 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          monthCounts[monthIndex] = (monthCounts[monthIndex] || 0) + 1;
        }
      }
    });

    return monthNames.map((name, index) => ({
      bulan: name,
      jumlah: monthCounts[index],
      fullMonth: `${name} ${selectedYear !== 'ALL' ? selectedYear : ''}`
    }));
  }, [filteredLaporan, selectedYear]);

  // Prepare daily timeline chart data
  const dailyChartData = useMemo(() => {
    const dateMap: Record<string, number> = {};
    filteredLaporan.forEach(lap => {
      if (lap.tanggal) {
        dateMap[lap.tanggal] = (dateMap[lap.tanggal] || 0) + 1;
      }
    });

    const sortedDates = Object.keys(dateMap).sort();
    return sortedDates.map(date => ({
      tanggal: date,
      jumlah: dateMap[date]
    }));
  }, [filteredLaporan]);

  // Group rekap per Guru
  const rekapPerGuru = useMemo(() => {
    const map = new Map<string, {
      guru_id: string;
      nama_guru: string;
      nip_guru: string;
      total: number;
      daftar_masalah: string[];
      tanggal_terakhir: string;
      pelapor_terakhir: string;
    }>();

    // Initialize all teachers from guruList or existing laporan
    guruList.forEach(g => {
      map.set(g.nama, {
        guru_id: g.id,
        nama_guru: g.nama,
        nip_guru: g.nip,
        total: 0,
        daftar_masalah: [],
        tanggal_terakhir: '-',
        pelapor_terakhir: '-'
      });
    });

    filteredLaporan.forEach(lap => {
      const key = lap.nama_guru || 'Lainnya';
      const existing = map.get(key) || {
        guru_id: lap.guru_id || 'unknown',
        nama_guru: key,
        nip_guru: lap.nip_guru || '-',
        total: 0,
        daftar_masalah: [],
        tanggal_terakhir: '-',
        pelapor_terakhir: '-'
      };

      existing.total += 1;
      if (lap.masalah && !existing.daftar_masalah.includes(lap.masalah)) {
        existing.daftar_masalah.push(lap.masalah);
      }
      if (existing.tanggal_terakhir === '-' || lap.tanggal > existing.tanggal_terakhir) {
        existing.tanggal_terakhir = lap.tanggal;
        existing.pelapor_terakhir = lap.pelapor_nama;
      }

      map.set(key, existing);
    });

    return Array.from(map.values())
      .filter(item => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return item.nama_guru.toLowerCase().includes(term) || item.nip_guru.toLowerCase().includes(term);
      })
      .sort((a, b) => b.total - a.total);
  }, [filteredLaporan, guruList, searchTerm]);

  // Statistics KPIs
  const totalLaporanCount = filteredLaporan.length;
  const guruDenganLaporanCount = rekapPerGuru.filter(r => r.total > 0).length;
  
  // Find highest violation month
  const peakMonth = useMemo(() => {
    let max = 0;
    let monthName = '-';
    monthlyChartData.forEach(d => {
      if (d.jumlah > max) {
        max = d.jumlah;
        monthName = d.bulan;
      }
    });
    return { name: monthName, count: max };
  }, [monthlyChartData]);

  // Export Rekap CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "No,Nama Guru,NIP,Total Laporan,Rincian Pelanggaran,Tanggal Terakhir\n";

    rekapPerGuru.forEach((row, idx) => {
      const masalahStr = `"${row.daftar_masalah.join('; ')}"`;
      csvContent += `${idx + 1},"${row.nama_guru}","${row.nip_guru}",${row.total},${masalahStr},"${row.tanggal_terakhir}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Pelanggaran_Guru_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Navigation Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 mb-1">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Menu Analisis & Rekap</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Grafik Trend & Rekapitulasi Pelanggaran Guru</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualisasi tren pelanggaran guru berbasis grafik line interaktif dan tabel rekapitulasi kumulatif.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center space-x-2 transition border border-slate-200"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor CSV Rekap</span>
          </button>

          <button
            onClick={() => setActiveMenu('cetak_rekap')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition shadow-md shadow-blue-600/20 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap A4</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Terlaporkan</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalLaporanCount} <span className="text-xs font-normal text-slate-500">kasus</span></p>
            <p className="text-[11px] text-slate-400 mt-1">Periode tahun {selectedYear}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Guru Terlibat</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{guruDenganLaporanCount} <span className="text-xs font-normal text-slate-500">dari {guruList.length} guru</span></p>
            <p className="text-[11px] text-slate-400 mt-1">
              {guruList.length > 0 ? `${Math.round((guruDenganLaporanCount / guruList.length) * 100)}% dari total guru` : 'Data guru tersedia'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Puncak Tren Bulanan</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">{peakMonth.name} <span className="text-xs font-normal text-slate-500">({peakMonth.count} kasus)</span></p>
            <p className="text-[11px] text-slate-400 mt-1">Bulan tertinggi pelanggaran</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Rata-Rata Bulanan</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {(totalLaporanCount / 12).toFixed(1)} <span className="text-xs font-normal text-slate-500">kasus/bln</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Indikator disiplin sekolah</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Chart Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Grafik Line Trend Pelanggaran Guru</h2>
              <p className="text-xs text-slate-500">Frekuensi kejadian laporan pelanggaran sepanjang tahun</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setChartMode('monthly')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  chartMode === 'monthly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bulanan (Jan - Des)
              </button>
              <button
                onClick={() => setChartMode('daily')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  chartMode === 'daily'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Per Tanggal Kejadian
              </button>
            </div>

            {/* Filter Year */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Semua Tahun</option>
              {availableYears.map(y => (
                <option key={y} value={y}>Tahun {y}</option>
              ))}
            </select>

            {/* Filter Guru */}
            <select
              value={selectedGuru}
              onChange={(e) => setSelectedGuru(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px] truncate"
            >
              <option value="ALL">Semua Guru ({guruList.length})</option>
              {guruList.map(g => (
                <option key={g.id} value={g.nama}>{g.nama}</option>
              ))}
            </select>
          </div>
        </div>

        {/* LINE CHART CONTAINER */}
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'monthly' ? (
              <AreaChart data={monthlyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorJumlah" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="bulan" 
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                  }}
                  itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                  formatter={(value: any) => [`${value} Laporan`, 'Jumlah Pelanggaran']}
                  labelFormatter={(label) => `Bulan ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="jumlah" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorJumlah)" 
                  dot={{ r: 5, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 8, stroke: '#1e40af', strokeWidth: 3 }}
                />
              </AreaChart>
            ) : (
              <LineChart data={dailyChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="tanggal" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#38bdf8' }}
                  formatter={(value: any) => [`${value} Kejadian`, 'Jumlah']}
                />
                <Line 
                  type="monotone" 
                  dataKey="jumlah" 
                  stroke="#0284c7" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#0284c7' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABEL REKAPITULASI DATA PER GURU */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-blue-600" />
              <span>Tabel Rekapitulasi Akumulasi Per Guru</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rincian total jumlah dan kategori kasus pelanggaran per masing-masing tenaga pendidik
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama atau NIP guru..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">NO</th>
                <th className="px-4 py-3.5">NAMA GURU & NIP</th>
                <th className="px-4 py-3.5 text-center w-36">AKUMULASI LAPORAN</th>
                <th className="px-4 py-3.5">RINCIAN KATEGORI MASALAH</th>
                <th className="px-4 py-3.5 w-36">TERAKHIR DILAPORKAN</th>
                <th className="px-4 py-3.5 text-right w-28">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {rekapPerGuru.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 italic">
                    Tidak ditemukan data rekapitulasi guru untuk kriteria pencarian ini.
                  </td>
                </tr>
              ) : (
                rekapPerGuru.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 text-center font-semibold text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 text-sm">{item.nama_guru}</div>
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">NIP. {item.nip_guru || '-'}</div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {item.total > 0 ? (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          item.total >= 3 
                            ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {item.total} Laporan
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          0 (Disiplin)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {item.daftar_masalah.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {item.daftar_masalah.map((m, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] border border-slate-200">
                              {m}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Belum ada rekam catatan</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{item.tanggal_terakhir}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[120px]" title={item.pelapor_terakhir}>
                        Oleh: {item.pelapor_terakhir}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setActiveMenu('cetak_rekap')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold inline-flex items-center space-x-1 transition shadow-sm"
                      >
                        <span>Cetak Rekap</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
