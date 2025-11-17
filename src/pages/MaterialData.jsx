import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Database, Download, X } from 'lucide-react';
import SelectDown from '../components/ui/SelectDown';

const MaterialData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelompok, setSelectedKelompok] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Data material MDU dari CSV
  const materialData = [
    { no: 1, deskripsi: "AAAC - S 240 sq mm", satuan: "B", hargaMaterial: "PLN", jasaPasang: "6.652", jasaBongkar: "3.991", ket: "Erect Only", kelompok: "MDU" },
    { no: 2, deskripsi: "ACO / ATS TR", satuan: "B", hargaMaterial: "PLN", jasaPasang: "701.414", jasaBongkar: "420.848", ket: "Erect Only", kelompok: "MDU" },
    { no: 3, deskripsi: "ACO TM", satuan: "B", hargaMaterial: "PLN", jasaPasang: "2.097.744", jasaBongkar: "1.258.646", ket: "Erect Only", kelompok: "MDU" },
    { no: 4, deskripsi: "Air Insulated Switchgear;TP;24kV;630A;16kA", satuan: "B", hargaMaterial: "PLN", jasaPasang: "758.244", jasaBongkar: "454.947", ket: "Erect Only", kelompok: "MDU" },
    { no: 5, deskripsi: "Alluminium Insulated Binding Wire", satuan: "B", hargaMaterial: "9.135", jasaPasang: "5.795", jasaBongkar: "3.477", ket: "Supply Erect", kelompok: "6. Pengikat Konduktor" },
    { no: 6, deskripsi: "Arm Tie Band 10\"(TM) (t = 6 mm x 42 mm) HDG TM lengkap Bolt&Nut-HDG", satuan: "B", hargaMaterial: "104.560", jasaPasang: "26.076", jasaBongkar: "15.646", ket: "Supply Erect", kelompok: "5. Pembesian" },
    { no: 7, deskripsi: "Arm Tie Band 6\"(TM) (t = 6 mm x 42 mm) HDG TM lengkap Bolt&Nut-HDG", satuan: "S", hargaMaterial: "70.516", jasaPasang: "26.076", jasaBongkar: "15.646", ket: "Supply Erect", kelompok: "5. Pembesian" },
    { no: 8, deskripsi: "Arm Tie Band 7\"(TM) (t = 6 mm x 42 mm) HDG TM lengkap Bolt&Nut-HDG", satuan: "M", hargaMaterial: "76.023", jasaPasang: "26.076", jasaBongkar: "15.646", ket: "Supply Erect", kelompok: "5. Pembesian" },
    { no: 9, deskripsi: "Arm tie siku 50x50x3,5 mm x 750 mm", satuan: "B", hargaMaterial: "71.307", jasaPasang: "4.056", jasaBongkar: "2.434", ket: "Supply Erect", kelompok: "5. Pembesian" },
    { no: 10, deskripsi: "Arm Tie Type 1500 - 1 1/2\" - (t=2,3mm)", satuan: "B", hargaMaterial: "126.766", jasaPasang: "7.243", jasaBongkar: "4.346", ket: "Supply Erect", kelompok: "5. Pembesian" },
    { no: 36, deskripsi: "Box APP Pengukuran Langsung tanpa MCCB Aluminium", satuan: "S", hargaMaterial: "PLN", jasaPasang: "347.684", jasaBongkar: "208.610", ket: "Erect Only", kelompok: "MDU" },
    { no: 37, deskripsi: "Box APP SPLU (charger)", satuan: "S", hargaMaterial: "PLN", jasaPasang: "230.616", jasaBongkar: "138.369", ket: "Erect Only", kelompok: "MDU" },
    { no: 42, deskripsi: "Cable Power ; NFA2X ; 4 x 16 mm", satuan: "S", hargaMaterial: "PLN", jasaPasang: "10.431", jasaBongkar: "6.258", ket: "Erect Only", kelompok: "MDU" },
    { no: 47, deskripsi: "Compresion Joint Bimetal 16/16 mm - Al/Cu", satuan: "B", hargaMaterial: "28.709", jasaPasang: "11.589", jasaBongkar: "6.954", ket: "Supply Erect", kelompok: "3. Connector" },
    { no: 48, deskripsi: "Compresion Joint Bimetal 25/25 mm - Al/Cu", satuan: "B", hargaMaterial: "54.047", jasaPasang: "11.589", jasaBongkar: "6.954", ket: "Supply Erect", kelompok: "3. Connector" },
    { no: 49, deskripsi: "Compresion Joint Sleeve 95 mm - Al", satuan: "B", hargaMaterial: "PLN", jasaPasang: "13.328", jasaBongkar: "7.997", ket: "Erect Only", kelompok: "3. Connector" },
    { no: 70, deskripsi: "CT - TR Class 0,5S", satuan: "B", hargaMaterial: "PLN", jasaPasang: "69.537", jasaBongkar: "41.722", ket: "Erect Only", kelompok: "MDU" },
    { no: 103, deskripsi: "LBS Motorized + RTU + Kabel Data", satuan: "B", hargaMaterial: "PLN", jasaPasang: "1.794.376", jasaBongkar: "1.076.626", ket: "Erect Only", kelompok: "MDU" },
    { no: 104, deskripsi: "Lemari APP Pengukuran Tidak Langsung Montage 225A Aluminium", satuan: "M", hargaMaterial: "PLN", jasaPasang: "329.451", jasaBongkar: "197.670", ket: "Erect Only", kelompok: "MDU" },
    { no: 122, deskripsi: "Load Break Switch 24 kV - 630 A Manual", satuan: "B", hargaMaterial: "PLN", jasaPasang: "1.345.782", jasaBongkar: "807.469", ket: "Erect Only", kelompok: "MDU" },
    { no: 125, deskripsi: "LVSB ; LV Panel 250A, 2 Jurusan (SPLN D3.016-1 : 2010)-LBS", satuan: "B", hargaMaterial: "PLN", jasaPasang: "701.414", jasaBongkar: "420.848", ket: "Erect Only", kelompok: "MDU" },
    { no: 127, deskripsi: "m Elektronik (ME) 3 ph - 4 W, teg: 57,7/100V; Arus :5A. Class: 0,5", satuan: "B", hargaMaterial: "PLN", jasaPasang: "434.605", jasaBongkar: "260.763", ket: "Erect Only", kelompok: "MDU" },
    { no: 145, deskripsi: "NA2XSEYBY 3 x 150 mm2;20kV;UG", satuan: "B", hargaMaterial: "PLN", jasaPasang: "41.492", jasaBongkar: "24.895", ket: "Erect Only", kelompok: "MDU" },
    { no: 148, deskripsi: "NFA2X 4x10 mm", satuan: "B", hargaMaterial: "PLN", jasaPasang: "11.763", jasaBongkar: "7.058", ket: "Erect Only", kelompok: "MDU" },
    { no: 171, deskripsi: "OA Kast type I C1 Sistim Press cat powder coating", satuan: "S", hargaMaterial: "PLN", jasaPasang: "434.605", jasaBongkar: "260.763", ket: "Erect Only", kelompok: "MDU" },
    { no: 204, deskripsi: "Panel APP TM", satuan: "Ls", hargaMaterial: "PLN", jasaPasang: "922.462", jasaBongkar: "553.477", ket: "Erect Only", kelompok: "MDU" },
    { no: 208, deskripsi: "PHB - TR 2 Jurusan 400 A - SPLN D5.016.1 : 2010", satuan: "Ls", hargaMaterial: "PLN", jasaPasang: "553.748", jasaBongkar: "332.249", ket: "Erect Only", kelompok: "MDU" },
    { no: 248, deskripsi: "Polymer Arrester 24 kV - 10 kA", satuan: "B", hargaMaterial: "PLN", jasaPasang: "28.974", jasaBongkar: "17.384", ket: "Erect Only", kelompok: "MDU" },
    { no: 251, deskripsi: "Potensial Trafo (PT) 20 kV - Outdoor", satuan: "B", hargaMaterial: "PLN", jasaPasang: "112.013", jasaBongkar: "67.208", ket: "Erect Only", kelompok: "MDU" },
    { no: 254, deskripsi: "Preformed Side Tie 150 mm (Semi Cond/non metalic/Composite)", satuan: "B", hargaMaterial: "PLN", jasaPasang: "8.692", jasaBongkar: "5.215", ket: "Erect Only", kelompok: "6. Pengikat Konduktor" },
    { no: 278, deskripsi: "AAAC - S 70 sq mm", satuan: "B", hargaMaterial: "PLN", jasaPasang: "4.657", jasaBongkar: "2.794", ket: "Erect Only", kelompok: "MDU" },
    { no: 308, deskripsi: "Cover Konduktor", satuan: "B", hargaMaterial: "PLN", jasaPasang: "46.123", jasaBongkar: "27.674", ket: "Erect Only", kelompok: "4. Cover Bushing" },
    { no: 309, deskripsi: "Cover Silicon Bushing Trafo", satuan: "B", hargaMaterial: "PLN", jasaPasang: "16.225", jasaBongkar: "9.735", ket: "Erect Only", kelompok: "4. Cover Bushing" },
    { no: 340, deskripsi: "NFA2XSEY-T 3 x 240 + 1 x 95 mm2 - CWS", satuan: "B", hargaMaterial: "PLN", jasaPasang: "55.323", jasaBongkar: "33.194", ket: "Erect Only", kelompok: "MDU" },
    { no: 373, deskripsi: "AAAC - 110 sqmm", satuan: "M", hargaMaterial: "PLN", jasaPasang: "3.991", jasaBongkar: "2.395", ket: "Erect Only", kelompok: "MDU" },
    { no: 386, deskripsi: "Box berisi RTU protocol DNP 3, IEC (siap komunikasi GSM)", satuan: "B", hargaMaterial: "PLN", jasaPasang: "347.684", jasaBongkar: "208.610", ket: "Erect Only", kelompok: "MDU" },
    { no: 388, deskripsi: "Cable Power ; NFA2X ; 4 x 35 mm", satuan: "S", hargaMaterial: "PLN", jasaPasang: "13.328", jasaBongkar: "7.997", ket: "Erect Only", kelompok: "MDU" },
    { no: 409, deskripsi: "Galvanized Steel Wire 22 mm - HDG", satuan: "S", hargaMaterial: "12.479", jasaPasang: "3.295", jasaBongkar: "1.977", ket: "Supply Erect", kelompok: "2. Conductor Wire and Cable" },
    { no: 417, deskripsi: "Insulator - Pin Post Insulator 20 kV;12,5 kN - Porcelain (Tumpu)", satuan: "S", hargaMaterial: "PLN", jasaPasang: "26.356", jasaBongkar: "15.814", ket: "Erect Only", kelompok: "MDU" },
    { no: 455, deskripsi: "Lightning Arrester 24 kV - 10 kA", satuan: "M", hargaMaterial: "PLN", jasaPasang: "45.199", jasaBongkar: "27.119", ket: "Erect Only", kelompok: "MDU" },
    { no: 485, deskripsi: "Polymer Cut Out Switch 24 kV + Fuse", satuan: "B", hargaMaterial: "PLN", jasaPasang: "18.543", jasaBongkar: "11.126", ket: "Erect Only", kelompok: "MDU" },
    { no: 486, deskripsi: "Pondasi type A (1 tiang) (91/u/2009)", satuan: "B", hargaMaterial: "492.236", jasaPasang: "295.332", jasaBongkar: "177.199", ket: "Supply Erect", kelompok: "Pendukung" },
    { no: 494, deskripsi: "Recloser 24 kV-630 A Motorized 12,5 kA c/w PTCC", satuan: "S", hargaMaterial: "PLN", jasaPasang: "2.242.971", jasaBongkar: "1.345.782", ket: "Erect Only", kelompok: "MDU" },
    { no: 598, deskripsi: "Tiang Beton 9 Meter - 200 daN", satuan: "B", hargaMaterial: "PLN", jasaPasang: "580.105", jasaBongkar: "348.063", ket: "Erect Only", kelompok: "MDU" },
    { no: 599, deskripsi: "Tiang Beton 11 Meter - 200 daN", satuan: "B", hargaMaterial: "PLN", jasaPasang: "696.126", jasaBongkar: "417.675", ket: "Erect Only", kelompok: "MDU" },
    { no: 600, deskripsi: "Tiang Beton 12 Meter - 350 daN", satuan: "B", hargaMaterial: "PLN", jasaPasang: "812.147", jasaBongkar: "487.288", ket: "Erect Only", kelompok: "MDU" },
    { no: 601, deskripsi: "Tiang Beton 13 Meter - 350 daN", satuan: "B", hargaMaterial: "PLN", jasaPasang: "870.157", jasaBongkar: "522.094", ket: "Erect Only", kelompok: "MDU" },
    { no: 602, deskripsi: "Tiang Beton 14 Meter - 350 daN", satuan: "B", hargaMaterial: "PLN", jasaPasang: "1.044.188", jasaBongkar: "626.513", ket: "Erect Only", kelompok: "MDU" },
    { no: 607, deskripsi: "Trafo Distribusi 20 kV 3 PH 50 kVA Yzn5 (D3)", satuan: "B", hargaMaterial: "PLN", jasaPasang: "901.216", jasaBongkar: "540.730", ket: "Erect Only", kelompok: "MDU" },
    { no: 608, deskripsi: "Trafo Distribusi 20 kV 3 PH 100 kVA Yzn5 (D3)", satuan: "B", hargaMaterial: "PLN", jasaPasang: "1.001.352", jasaBongkar: "600.811", ket: "Erect Only", kelompok: "MDU" },
    { no: 609, deskripsi: "Trafo Distribusi 20 kV 3 PH 160 kVA Yzn5 (D3)", satuan: "B", hargaMaterial: "PLN", jasaPasang: "1.201.622", jasaBongkar: "720.973", ket: "Erect Only", kelompok: "MDU" },
    { no: 610, deskripsi: "Trafo Distribusi 20 kV 3 PH 200 kVA Dyn5 (D3)", satuan: "B", hargaMaterial: "PLN", jasaPasang: "1.301.757", jasaBongkar: "781.054", ket: "Erect Only", kelompok: "MDU" },
    { no: 611, deskripsi: "Trafo Distribusi 20 kV 3 PH 250 kVA Dyn5 (D3)", satuan: "B", hargaMaterial: "PLN", jasaPasang: "1.502.027", jasaBongkar: "901.216", ket: "Erect Only", kelompok: "MDU" },
  ];

  // Kelompok unik untuk filter
  const kelompokList = useMemo(() => {
    const unique = [...new Set(materialData.map(item => item.kelompok))];
    return ['Semua', ...unique.sort()];
  }, []);

  // Filter dan search
  const filteredData = useMemo(() => {
    let filtered = materialData;

    // Filter by kelompok
    if (selectedKelompok !== 'Semua') {
      filtered = filtered.filter(item => item.kelompok === selectedKelompok);
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.deskripsi.toLowerCase().includes(query) ||
        item.no.toString().includes(query) ||
        item.satuan.toLowerCase().includes(query) ||
        item.kelompok.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedKelompok]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedKelompok]);

  const formatRupiah = (value) => {
    if (value === 'PLN' || value === '-') return value;
    const num = parseFloat(value.replace(/\./g, ''));
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3"
      >
        <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-1">
                  Data Material MDU
                </h1>
                <p className="text-gray-600 flex items-center gap-2 text-xs">
                  <Database className="w-3.5 h-3.5" />
                  Database material PLN untuk instalasi listrik
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-3 rounded-lg shadow-md border border-emerald-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-0.5">Total Material</p>
                  <p className="text-xl font-bold text-emerald-600">{materialData.length}</p>
                </div>
                <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Database className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-3 rounded-lg shadow-md border border-blue-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-0.5">Kelompok Material</p>
                  <p className="text-xl font-bold text-blue-600">{kelompokList.length - 1}</p>
                </div>
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                  <Filter className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-3 rounded-lg shadow-md border border-purple-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs font-medium mb-0.5">Hasil Filter</p>
                  <p className="text-xl font-bold text-purple-600">{filteredData.length}</p>
                </div>
                <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-3 rounded-lg shadow-md mb-3 border border-gray-100"
          >
            <div className="flex gap-3">
              {/* Search */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Cari Material
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan nama, nomor, atau satuan..."
                    className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Kelompok Filter */}
              <div className="w-64">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Kelompok Material
                </label>
                <SelectDown
                  value={selectedKelompok}
                  onChange={(e) => setSelectedKelompok(e.target.value)}
                  className="text-sm"
                >
                  {kelompokList.map(kelompok => (
                    <option key={kelompok} value={kelompok}>
                      {kelompok}
                    </option>
                  ))}
                </SelectDown>
              </div>
            </div>
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-semibold">No</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold">Deskripsi Material</th>
                    <th className="px-2 py-2 text-center text-xs font-semibold">Satuan</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold">Harga Material</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold">Jasa Pasang</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold">Jasa Bongkar</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold">Keterangan</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold">Kelompok</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <motion.tr
                        key={item.no}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-2 py-2 text-xs text-gray-600">{item.no}</td>
                        <td className="px-3 py-2 text-xs text-gray-900">
                          {item.deskripsi}
                        </td>
                        <td className="px-2 py-2 text-xs text-center">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {item.satuan}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-right">
                          {item.hargaMaterial === 'PLN' ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                              PLN
                            </span>
                          ) : (
                            <span className="text-gray-900 font-medium">
                              Rp {formatRupiah(item.hargaMaterial)}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs text-right text-gray-900">
                          Rp {formatRupiah(item.jasaPasang)}
                        </td>
                        <td className="px-3 py-2 text-xs text-right text-gray-900">
                          Rp {formatRupiah(item.jasaBongkar)}
                        </td>
                        <td className="px-3 py-2 text-xs text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            item.ket === 'Erect Only' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.ket}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            {item.kelompok}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                        <Database className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm font-medium">Tidak ada data ditemukan</p>
                        <p className="text-xs">Coba ubah filter atau kata kunci pencarian</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-3 py-2.5 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">
                    Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} material
                  </p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-2.5 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-emerald-600 text-white'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      {totalPages > 5 && <span className="px-2 py-1 text-xs text-gray-600">...</span>}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2.5 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
    </div>
  );
};

export default MaterialData;
