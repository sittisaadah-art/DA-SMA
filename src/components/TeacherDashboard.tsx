import React, { useState, useEffect, useMemo } from 'react';
import {
  ExamSubmission,
  ProgramType,
  ExamStatus,
} from '../types/assessment';
import { QUESTIONS_PG, QUESTIONS_ESSAY } from '../data/questionsData';
import { apiService } from '../services/apiService';
import {
  Users,
  Award,
  AlertTriangle,
  Clock,
  TrendingUp,
  Search,
  Filter,
  Download,
  Printer,
  RefreshCw,
  LogOut,
  Unlock,
  CheckCircle2,
  Edit3,
  Trash2,
  BarChart3,
  BookOpen,
  ShieldAlert,
  ChevronRight,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface TeacherDashboardProps {
  onLogout: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Selected Student for Essay Review Modal
  const [reviewingStudent, setReviewingStudent] = useState<ExamSubmission | null>(null);
  const [editEssayScores, setEditEssayScores] = useState<Record<number, number>>({});
  const [editTeacherNotes, setEditTeacherNotes] = useState('');
  const [savingReview, setSavingReview] = useState(false);

  // Active Tab: Analytics vs Student Table
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TABLE'>('OVERVIEW');

  // Fetch submissions from API/LocalStorage
  const fetchSubmissions = async () => {
    setIsRefreshing(true);
    const data = await apiService.getAllSubmissions();
    setSubmissions(data);
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchSubmissions();
    // Real-time polling every 6 seconds
    const interval = setInterval(() => {
      fetchSubmissions();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Distinct classes present in data
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    submissions.forEach((s) => {
      if (s.student.className) set.add(s.student.className);
    });
    return Array.from(set).sort();
  }, [submissions]);

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchSearch =
        sub.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.student.studentId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchProgram =
        selectedProgram === 'ALL' || sub.student.program === selectedProgram;

      const matchClass =
        selectedClass === 'ALL' || sub.student.className === selectedClass;

      const matchStatus =
        selectedStatus === 'ALL' || sub.status === selectedStatus;

      return matchSearch && matchProgram && matchClass && matchStatus;
    });
  }, [submissions, searchQuery, selectedProgram, selectedClass, selectedStatus]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = submissions.length;
    const submitted = submissions.filter((s) => s.status === 'SUBMITTED').length;
    const locked = submissions.filter((s) => s.status === 'LOCKED_CHEAT').length;
    const inProgress = submissions.filter((s) => s.status === 'IN_PROGRESS').length;

    const scores = submissions.map((s) => s.totalScore);
    const avgScore = total > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0;
    const maxScore = total > 0 ? Math.max(...scores) : 0;
    const minScore = total > 0 ? Math.min(...scores) : 0;
    const passingCount = submissions.filter((s) => s.totalScore >= 75).length;
    const passingRate = total > 0 ? Math.round((passingCount / total) * 100) : 0;

    return {
      total,
      submitted,
      locked,
      inProgress,
      avgScore,
      maxScore,
      minScore,
      passingCount,
      passingRate,
    };
  }, [submissions]);

  // Class Analytics (Average per class)
  const classAnalytics = useMemo(() => {
    const classMap: Record<
      string,
      { count: number; sum: number; highest: number; lowest: number; program: string }
    > = {};

    submissions.forEach((sub) => {
      const cls = sub.student.className || 'Lainnya';
      if (!classMap[cls]) {
        classMap[cls] = {
          count: 0,
          sum: 0,
          highest: 0,
          lowest: 100,
          program: sub.student.program,
        };
      }
      classMap[cls].count += 1;
      classMap[cls].sum += sub.totalScore;
      classMap[cls].highest = Math.max(classMap[cls].highest, sub.totalScore);
      classMap[cls].lowest = Math.min(classMap[cls].lowest, sub.totalScore);
    });

    return Object.entries(classMap).map(([className, data]) => ({
      className,
      program: data.program,
      count: data.count,
      avg: Math.round(data.sum / data.count),
      highest: data.highest,
      lowest: data.lowest,
    })).sort((a, b) => b.avg - a.avg);
  }, [submissions]);

  // Score Distribution
  const scoreDistribution = useMemo(() => {
    const counts = {
      sangatBaik: 0, // >= 85
      baik: 0, // 75 - 84
      cukup: 0, // 65 - 74
      remedial: 0, // < 65
    };

    submissions.forEach((s) => {
      if (s.totalScore >= 85) counts.sangatBaik++;
      else if (s.totalScore >= 75) counts.baik++;
      else if (s.totalScore >= 65) counts.cukup++;
      else counts.remedial++;
    });

    return counts;
  }, [submissions]);

  // Item Analysis (Day Serap Butir Soal PG 1-10)
  const itemAnalysisPG = useMemo(() => {
    return QUESTIONS_PG.map((q) => {
      let correctCount = 0;
      let totalAnswered = 0;
      submissions.forEach((sub) => {
        if (sub.answersPG && sub.answersPG[q.id]) {
          totalAnswered++;
          if (sub.answersPG[q.id] === q.correctAnswer) {
            correctCount++;
          }
        }
      });
      const percent = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
      return {
        id: q.id,
        number: q.number,
        topic: q.topic,
        correctCount,
        totalAnswered,
        percent,
      };
    });
  }, [submissions]);

  // Unlock Student Handler
  const handleUnlockStudent = async (studentId: string, studentName: string) => {
    if (
      window.confirm(
        `Buka kunci ujian untuk siswa "${studentName}"? Siswa akan dapat melanjutkan kembali ujian.`
      )
    ) {
      await apiService.unlockStudent(studentId);
      await fetchSubmissions();
    }
  };

  // Delete Student Handler
  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (window.confirm(`Hapus data ujian siswa "${studentName}" dari sistem?`)) {
      await apiService.deleteSubmission(studentId);
      await fetchSubmissions();
    }
  };

  // Open Essay Review Modal
  const openEssayReview = (student: ExamSubmission) => {
    setReviewingStudent(student);
    setEditEssayScores({ ...student.essayScores });
    setEditTeacherNotes(student.teacherNotes || '');
  };

  // Save Essay Review
  const handleSaveEssayReview = async () => {
    if (!reviewingStudent) return;
    setSavingReview(true);
    await apiService.reviewEssayScore(
      reviewingStudent.id,
      editEssayScores,
      editTeacherNotes
    );
    await fetchSubmissions();
    setSavingReview(false);
    setReviewingStudent(null);
  };

  // Reset to Demo Data
  const handleLoadDemo = async () => {
    if (window.confirm('Muat ulang data demonstrasi kelas X dan X Cambridge?')) {
      await apiService.resetToDemo();
      await fetchSubmissions();
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'No',
      'NISN/Absen',
      'Nama Siswa',
      'Program',
      'Kelas',
      'Nilai PG',
      'Nilai Essay',
      'Total Nilai',
      'Grade',
      'Status Ujian',
      'Pelanggaran Tab',
      'Waktu Submit',
    ];

    const rows = filteredSubmissions.map((s, idx) => {
      const grade =
        s.totalScore >= 90 ? 'A' : s.totalScore >= 80 ? 'B' : s.totalScore >= 75 ? 'C' : 'D';
      return [
        idx + 1,
        `"${s.student.studentId}"`,
        `"${s.student.name}"`,
        `"${s.student.program}"`,
        `"${s.student.className}"`,
        s.scorePG,
        s.scoreEssay,
        s.totalScore,
        grade,
        s.status,
        s.tabViolations,
        `"${new Date(s.submittedAt || s.startedAt).toLocaleString('id-ID')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Nilai_Informatika_SMA_X_Bab1_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Recap Sheet
  const handlePrintRecap = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      {/* Essay Manual Review Modal */}
      {reviewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="max-w-3xl w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Koreksi & Penyesuaian Nilai Essay Guru
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {reviewingStudent.student.name} ({reviewingStudent.student.className})
                </h3>
              </div>
              <button
                onClick={() => setReviewingStudent(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {QUESTIONS_ESSAY.map((essay) => {
                const currentScore = editEssayScores[essay.id] ?? 0;
                const studentAns = reviewingStudent.answersEssay[essay.id] || '';

                return (
                  <div
                    key={essay.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-400">
                        Essay #{essay.number}: {essay.topic}
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-400">Skor (Maks 8):</label>
                        <input
                          type="number"
                          min={0}
                          max={8}
                          value={currentScore}
                          onChange={(e) => {
                            const val = Math.min(8, Math.max(0, Number(e.target.value)));
                            setEditEssayScores((prev) => ({
                              ...prev,
                              [essay.id]: val,
                            }));
                          }}
                          className="w-16 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-600 text-white font-mono font-bold text-center text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-medium">{essay.question}</p>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">
                        Jawaban Siswa:
                      </span>
                      <p className="text-slate-200 italic leading-relaxed">
                        {studentAns || '(Tidak ada jawaban)'}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">Rubrik Acuan: </span>
                      {essay.rubricGuide}
                    </div>
                  </div>
                );
              })}

              {/* Teacher Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Catatan Guru / Pembina (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={editTeacherNotes}
                  onChange={(e) => setEditTeacherNotes(e.target.value)}
                  placeholder="Tambahkan catatan khusus untuk siswa..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setReviewingStudent(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={savingReview}
                onClick={handleSaveEssayReview}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{savingReview ? 'Menyimpan...' : 'Simpan & Perbarui Nilai'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-base text-white">
                  Dashboard Pengajar & Analisis Kelas
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Informatika SMA Kelas X • Bab 1 Menelusuri Data dan Kebenaran Informasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={fetchSubmissions}
              disabled={isRefreshing}
              className="p-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
              title="Perbarui Data Sekarang"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
            </button>

            <button
              onClick={handleLoadDemo}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-medium transition-colors"
              title="Muat Sampel Data"
            >
              <span>Sampel Demo</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-medium transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Ekspor CSV</span>
            </button>

            <button
              onClick={handlePrintRecap}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak Rekap</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 space-y-6">
        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 print:grid-cols-3">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Total Peserta</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {metrics.total}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Siswa Terdata</div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Selesai Submit</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
              {metrics.submitted}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Tuntas Mengerjakan</div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Terkunci Curang</span>
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-red-400 mt-1">
              {metrics.locked}
            </div>
            <div className="text-[11px] text-red-400/80 mt-1">&gt; 3x Pindah Tab</div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Rata-Rata Nilai</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-300 mt-1">
              {metrics.avgScore}
              <span className="text-xs text-slate-500 font-normal">/100</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Seluruh Kelas</div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Tertinggi / Terendah</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-1">
              {metrics.maxScore} <span className="text-xs text-slate-500">/ {metrics.minScore}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Rentang Nilai</div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Tuntas KKM (&ge;75)</span>
              <span className="text-xs font-bold text-emerald-400">{metrics.passingRate}%</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {metrics.passingCount}
              <span className="text-xs text-slate-500 font-normal">/{metrics.total}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Tingkat Kelulusan</div>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 print:hidden">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'OVERVIEW'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Grafik Analisis Real-Time Per Kelas</span>
          </button>
          <button
            onClick={() => setActiveTab('TABLE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'TABLE'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Tabel Rekapitulasi & Koreksi Siswa ({filteredSubmissions.length})</span>
          </button>
        </div>

        {/* TAB 1: ANALYTICS & CHARTS */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Row 1: Class Comparison & Score Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Average Score Per Class (Bar Chart) */}
              <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                      Komparasi Rata-Rata Nilai Per Kelas
                    </h3>
                    <p className="text-xs text-slate-400">
                      Perbandingan performa kelas X Reguler vs X Cambridge
                    </p>
                  </div>
                  <span className="text-xs text-blue-400 font-semibold">KKM: 75</span>
                </div>

                {classAnalytics.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    Belum ada data siswa yang masuk.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {classAnalytics.map((item) => {
                      const isPassing = item.avg >= 75;
                      const widthPercent = Math.min(100, Math.max(10, item.avg));
                      return (
                        <div key={item.className} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white flex items-center gap-2">
                              {item.className}
                              <span className="text-[10px] font-normal text-slate-400">
                                ({item.count} Siswa)
                              </span>
                            </span>
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-slate-400 text-[11px]">
                                Min: {item.lowest} | Max: {item.highest}
                              </span>
                              <span
                                className={`font-bold px-2 py-0.5 rounded ${
                                  isPassing
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-red-500/20 text-red-300'
                                }`}
                              >
                                {item.avg}
                              </span>
                            </div>
                          </div>

                          <div className="h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 relative">
                            <div
                              style={{ width: `${widthPercent}%` }}
                              className={`h-full rounded-full transition-all duration-700 ${
                                item.program === 'X Cambridge'
                                  ? 'bg-gradient-to-r from-indigo-500 to-sky-400'
                                  : 'bg-gradient-to-r from-blue-600 to-teal-400'
                              }`}
                            />
                            {/* KKM vertical marker at 75% */}
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-amber-400/80 z-10"
                              style={{ left: '75%' }}
                              title="Garis KKM (75)"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Score Distribution Breakdown */}
              <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2 mb-1">
                    <Award className="w-5 h-5 text-amber-400" />
                    Distribusi Kategori Nilai
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Klasifikasi hasil belajar berdasarkan predikat kurikulum
                  </p>

                  <div className="space-y-3">
                    {/* Sangat Baik */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        <div>
                          <div className="text-xs font-bold text-white">Sangat Baik (A)</div>
                          <div className="text-[10px] text-slate-400">Rentang Skor 85 - 100</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-emerald-400">
                          {scoreDistribution.sangatBaik}
                        </span>
                        <span className="text-xs text-slate-500 ml-1">Siswa</span>
                      </div>
                    </div>

                    {/* Baik */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-blue-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-400" />
                        <div>
                          <div className="text-xs font-bold text-white">Baik (B)</div>
                          <div className="text-[10px] text-slate-400">Rentang Skor 75 - 84</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-blue-400">
                          {scoreDistribution.baik}
                        </span>
                        <span className="text-xs text-slate-500 ml-1">Siswa</span>
                      </div>
                    </div>

                    {/* Cukup */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        <div>
                          <div className="text-xs font-bold text-white">Cukup (C)</div>
                          <div className="text-[10px] text-slate-400">Rentang Skor 65 - 74</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-amber-400">
                          {scoreDistribution.cukup}
                        </span>
                        <span className="text-xs text-slate-500 ml-1">Siswa</span>
                      </div>
                    </div>

                    {/* Remedial */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-red-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div>
                          <div className="text-xs font-bold text-white">Perlu Remedial (D)</div>
                          <div className="text-[10px] text-slate-400">Skor di bawah 65</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-red-400">
                          {scoreDistribution.remedial}
                        </span>
                        <span className="text-xs text-slate-500 ml-1">Siswa</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/60 text-xs text-slate-400 flex items-center justify-between">
                  <span>Target Ketuntasan Klasikal: 80%</span>
                  <span className="font-bold text-white">Capaian Saat Ini: {metrics.passingRate}%</span>
                </div>
              </div>
            </div>

            {/* Row 2: Item Analysis (Daya Serap Butir Soal PG 1 - 10) */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    Analisis Daya Serap Butir Soal (Pilihan Ganda 1 - 10)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Persentase siswa yang menjawab benar per indikator materi dari buku Smart Book Bab 1
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>&ge; 75% (Tinggi)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>50-74% (Sedang)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span>&lt; 50% (Sulit)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {itemAnalysisPG.map((item) => {
                  const badgeColor =
                    item.percent >= 75
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                      : item.percent >= 50
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                      : 'text-red-400 bg-red-500/10 border-red-500/30';

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/70 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                            #{item.number}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${badgeColor}`}>
                            {item.percent}%
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-200 line-clamp-2 mb-1">
                          {item.topic}
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
                        <span>Benar: {item.correctCount}</span>
                        <span>Total: {item.totalAnswered}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED STUDENT TABLE & ACTIONS */}
        {activeTab === 'TABLE' && (
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in duration-200">
            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama atau NISN..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Filter Program */}
              <div>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">Semua Program (X & X Cambridge)</option>
                  <option value="X">Kelas X (Reguler)</option>
                  <option value="X Cambridge">Kelas X Cambridge</option>
                </select>
              </div>

              {/* Filter Class */}
              <div>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">Semua Kelas</option>
                  {availableClasses.map((c) => (
                    <option key={c} value={c}>
                      Kelas {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Status */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="SUBMITTED">Selesai (Submitted)</option>
                  <option value="LOCKED_CHEAT">Terkunci (Curang)</option>
                  <option value="IN_PROGRESS">Sedang Mengerjakan</option>
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-700">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-4">NISN / Absen</th>
                    <th className="py-3 px-4">Kelas</th>
                    <th className="py-3 px-4 text-center">PG (60)</th>
                    <th className="py-3 px-4 text-center">Essay (40)</th>
                    <th className="py-3 px-4 text-center">Total (100)</th>
                    <th className="py-3 px-4 text-center">Pindah Tab</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Aksi Guru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-500">
                        Tidak ada data siswa yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub, idx) => {
                      const isPassing = sub.totalScore >= 75;

                      return (
                        <tr key={sub.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-3.5 px-4 font-semibold text-white">
                            {sub.student.name}
                            {sub.verifiedByTeacher && (
                              <span className="ml-1.5 inline-block text-[10px] text-blue-400">
                                (Terkoreksi)
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-400">
                            {sub.student.studentId}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 font-medium">
                              {sub.student.className}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-400">
                            {sub.scorePG}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-indigo-400">
                            {sub.scoreEssay}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`font-black font-mono text-sm px-2 py-0.5 rounded-lg ${
                                isPassing
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : 'bg-red-500/15 text-red-400'
                              }`}
                            >
                              {sub.totalScore}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                sub.tabViolations > 3
                                  ? 'bg-red-500/20 text-red-400'
                                  : sub.tabViolations > 0
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'text-slate-400'
                              }`}
                            >
                              {sub.tabViolations}x
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {sub.status === 'LOCKED_CHEAT' ? (
                              <span className="px-2 py-0.5 rounded-md bg-red-600/20 border border-red-500/40 text-red-400 text-[10px] font-bold">
                                Terkunci (Curang)
                              </span>
                            ) : sub.status === 'SUBMITTED' ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                                Selesai
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-blue-600/20 border border-blue-500/40 text-blue-400 text-[10px] font-bold">
                                Mengerjakan
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Essay Review Button */}
                              <button
                                onClick={() => openEssayReview(sub)}
                                className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-colors"
                                title="Koreksi Essay & Beri Catatan"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Unlock Button if locked */}
                              {sub.status === 'LOCKED_CHEAT' && (
                                <button
                                  onClick={() => handleUnlockStudent(sub.id, sub.student.name)}
                                  className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors"
                                  title="Buka Kunci Ujian Siswa Ini"
                                >
                                  <Unlock className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteStudent(sub.id, sub.student.name)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                                title="Hapus Data Siswa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Printable Official Recap Section (Visible ONLY during print) */}
        <div className="hidden print:block text-black bg-white p-6 font-sans">
          <div className="text-center border-b-2 border-black pb-3 mb-4">
            <h2 className="text-lg font-bold uppercase">
              REKAPITULASI NILAI ASESMEN HARIAN INFORMATIKA KELAS X
            </h2>
            <p className="text-xs">
              BAB 1: Menelusuri Data dan Kebenaran Informasi di Dunia Digital • Semester Ganjil
            </p>
            <p className="text-[11px] text-gray-600">
              Dicetak pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <table className="w-full text-[10px] border border-black border-collapse text-left mb-6">
            <thead>
              <tr className="bg-gray-200 border-b border-black">
                <th className="p-1 border-r border-black">No</th>
                <th className="p-1 border-r border-black">NISN/Absen</th>
                <th className="p-1 border-r border-black">Nama Siswa</th>
                <th className="p-1 border-r border-black">Kelas</th>
                <th className="p-1 border-r border-black text-center">Nilai PG</th>
                <th className="p-1 border-r border-black text-center">Nilai Essay</th>
                <th className="p-1 border-r border-black text-center">Total</th>
                <th className="p-1 border-r border-black text-center">Peringatan Tab</th>
                <th className="p-1 text-center">Ketuntasan</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((s, idx) => (
                <tr key={s.id} className="border-b border-black">
                  <td className="p-1 border-r border-black">{idx + 1}</td>
                  <td className="p-1 border-r border-black font-mono">{s.student.studentId}</td>
                  <td className="p-1 border-r border-black font-bold uppercase">{s.student.name}</td>
                  <td className="p-1 border-r border-black">{s.student.className}</td>
                  <td className="p-1 border-r border-black text-center">{s.scorePG}</td>
                  <td className="p-1 border-r border-black text-center">{s.scoreEssay}</td>
                  <td className="p-1 border-r border-black text-center font-bold">{s.totalScore}</td>
                  <td className="p-1 border-r border-black text-center">{s.tabViolations}x</td>
                  <td className="p-1 text-center font-bold">
                    {s.totalScore >= 75 ? 'TUNTAS' : 'REMEDIAL'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end text-xs pt-4">
            <div className="text-center w-56">
              <p>Guru Pengampu Informatika,</p>
              <div className="h-16" />
              <p className="font-bold underline uppercase">Sitti Sa'adah, S.Kom., M.Pd.</p>
              <p className="text-[10px]">NIP. 198506122010012015</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-3 px-4 text-center text-xs text-slate-500 print:hidden">
        Sistem Manajemen Asesmen Informatika SMA • Guru Pengampu • Real-Time Database Sync
      </footer>
    </div>
  );
};
