import React, { useState, useEffect } from 'react';
import { ExamSubmission } from '../types/assessment';
import { QUESTIONS_PG, QUESTIONS_ESSAY } from '../data/questionsData';
import { PrintCertificate } from './PrintCertificate';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  Printer,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  AlertTriangle,
  HelpCircle,
  FileText,
  Clock,
  ShieldCheck,
  Code,
} from 'lucide-react';

interface StudentResultProps {
  submission: ExamSubmission;
  onRetake: () => void;
}

export const StudentResult: React.FC<StudentResultProps> = ({ submission, onRetake }) => {
  const [showReview, setShowReview] = useState(false);
  const isPassing = submission.totalScore >= 75;

  // Trigger confetti on initial mount if score >= 75
  useEffect(() => {
    if (isPassing) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // canvas-confetti fallback
      }
    }
  }, [isPassing]);

  const handlePrint = () => {
    window.print();
  };

  const getGradeInfo = () => {
    if (submission.totalScore >= 90) return { label: 'A', text: 'Sangat Baik (Sempurna)', color: 'text-emerald-400' };
    if (submission.totalScore >= 80) return { label: 'B', text: 'Baik (Memuaskan)', color: 'text-blue-400' };
    if (submission.totalScore >= 75) return { label: 'C', text: 'Cukup (Tuntas KKM)', color: 'text-amber-400' };
    return { label: 'D', text: 'Perlu Bimbingan (Remedial)', color: 'text-red-400' };
  };

  const gradeInfo = getGradeInfo();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4">
      {/* Hidden printable document for print dialog */}
      <PrintCertificate submission={submission} />

      {/* Screen Interactive View */}
      <div className="max-w-4xl mx-auto space-y-6 print:hidden">
        {/* Top Header Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div
            className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
              isPassing ? 'bg-emerald-500/10' : 'bg-red-500/10'
            }`}
          />

          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shrink-0 ${
                  isPassing
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {isPassing ? <Award className="w-9 h-9" /> : <AlertTriangle className="w-9 h-9" />}
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Laporan Hasil Asesmen Mandiri
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {submission.student.name}
                </h2>
                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-blue-400 font-semibold">{submission.student.className}</span>
                  <span>•</span>
                  <span>NISN: {submission.student.studentId}</span>
                  <span>•</span>
                  <span>Program: {submission.student.program}</span>
                </div>
              </div>
            </div>

            {/* Print & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all shadow-blue-600/20"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
              <button
                onClick={onRetake}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-700/70 text-slate-300 font-medium text-xs transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Halaman Utama</span>
              </button>
            </div>
          </div>

          {/* Cheat Warning notice if locked */}
          {submission.status === 'LOCKED_CHEAT' && (
            <div className="mt-6 p-4 bg-red-950/60 border border-red-500/40 rounded-2xl text-xs text-red-300 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-200">Ujian Telah Dikunci oleh Sistem: </span>
                Siswa terdeteksi berpindah tab sebanyak {submission.tabViolations} kali. Nilai di bawah ini merupakan akumulasi jawaban yang sempat tersimpan.
              </div>
            </div>
          )}

          {/* Scores Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-700/60">
            {/* Total Score */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 text-center">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Nilai Akhir
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                {submission.totalScore}
                <span className="text-xs font-normal text-slate-500 ml-1">/100</span>
              </div>
              <div className={`text-xs font-bold mt-1 ${gradeInfo.color}`}>
                Grade {gradeInfo.label} • {isPassing ? 'TUNTAS' : 'REMEDIAL'}
              </div>
            </div>

            {/* PG Score */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 text-center">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Pilihan Ganda
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 mt-1">
                {submission.scorePG}
                <span className="text-xs font-normal text-slate-500 ml-1">/60</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {Object.keys(submission.answersPG).filter(k => {
                  const q = QUESTIONS_PG.find(item => item.id === Number(k));
                  return q && submission.answersPG[Number(k)] === q.correctAnswer;
                }).length} dari 10 Soal Benar
              </div>
            </div>

            {/* Essay Score */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 text-center">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Uraian / Essay
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1">
                {submission.scoreEssay}
                <span className="text-xs font-normal text-slate-500 ml-1">/40</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {submission.verifiedByTeacher ? 'Diverifikasi Guru' : 'Penilaian Otomatis'}
              </div>
            </div>

            {/* Time Elapsed & Violations */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 text-center">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Durasi & Integritas
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-200 mt-1">
                {Math.round(submission.durationSeconds / 60)} Menit
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tab Pindah: {submission.tabViolations}x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Review Answers Accordion */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-xl">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-blue-400 transition-colors">
                  Tinjau Pembahasan Soal & Kunci Jawaban
                </h3>
                <p className="text-xs text-slate-400">
                  Lihat analisis mendalam setiap butir soal untuk pengayaan literasi digital Anda
                </p>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 text-slate-300 group-hover:bg-slate-700 transition-colors">
              {showReview ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          {showReview && (
            <div className="mt-6 pt-6 border-t border-slate-700/60 space-y-8 animate-in fade-in duration-300">
              {/* Part 1: Multiple Choice Review */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h4 className="font-bold text-sm text-white uppercase tracking-wider">
                    Bagian 1: Pembahasan 10 Soal Pilihan Ganda
                  </h4>
                </div>

                <div className="space-y-4">
                  {QUESTIONS_PG.map((q) => {
                    const studentAns = submission.answersPG[q.id];
                    const isCorrect = studentAns === q.correctAnswer;
                    return (
                      <div
                        key={q.id}
                        className={`p-4 sm:p-5 rounded-2xl border ${
                          isCorrect
                            ? 'bg-slate-900/60 border-emerald-500/30'
                            : 'bg-slate-900/60 border-red-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                                isCorrect
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {q.number}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">
                              Topik: {q.topic}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              isCorrect
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'bg-red-500/15 text-red-400'
                            }`}
                          >
                            {isCorrect ? '+6 Poin (Benar)' : '0 Poin (Salah)'}
                          </span>
                        </div>

                        {/* Question Text */}
                        <p className="text-xs sm:text-sm text-slate-200 font-medium mt-2 leading-relaxed">
                          {q.question}
                        </p>

                        {/* Options comparison */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                            <span className="text-slate-500 block mb-0.5 text-[10px] uppercase">
                              Jawaban Anda:
                            </span>
                            <span
                              className={`font-mono font-bold ${
                                isCorrect ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              {studentAns
                                ? `${studentAns}. ${q.options.find(o => o.key === studentAns)?.text}`
                                : 'Tidak dijawab'}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                            <span className="text-slate-500 block mb-0.5 text-[10px] uppercase">
                              Kunci Jawaban Resmi:
                            </span>
                            <span className="font-mono font-bold text-emerald-400">
                              {q.correctAnswer}. {q.options.find(o => o.key === q.correctAnswer)?.text}
                            </span>
                          </div>
                        </div>

                        {/* Explanation */}
                        <div className="mt-3 p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200 leading-relaxed">
                          <span className="font-bold text-blue-400">Penjelasan Konsep: </span>
                          {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Part 2: Essay Review */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <h4 className="font-bold text-sm text-white uppercase tracking-wider">
                    Bagian 2: Tinjauan 5 Soal Uraian / Essay
                  </h4>
                </div>

                <div className="space-y-4">
                  {QUESTIONS_ESSAY.map((essay) => {
                    const studentAns = submission.answersEssay[essay.id] || '';
                    const score = submission.essayScores[essay.id] ?? 0;
                    const feedback = submission.essayFeedback?.[essay.id];

                    return (
                      <div
                        key={essay.id}
                        className="p-5 rounded-2xl border border-slate-700 bg-slate-900/60 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 text-xs font-bold flex items-center justify-center">
                              {essay.number + 10}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">
                              Topik: {essay.topic}
                            </span>
                          </div>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300">
                            Skor: {score} / 8 Poin
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-200 font-semibold leading-relaxed">
                          {essay.question}
                        </p>

                        {/* Student answer text */}
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                          <span className="text-slate-500 block mb-1 font-semibold uppercase text-[10px]">
                            Uraian Jawaban Siswa:
                          </span>
                          <p className="text-slate-300 leading-relaxed italic">
                            {studentAns || '(Tidak ada jawaban tertulis)'}
                          </p>
                        </div>

                        {/* Evaluator Feedback */}
                        {feedback && (
                          <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
                            <span className="font-bold">Analisis Jawaban: </span>
                            {feedback}
                          </div>
                        )}

                        {/* Sample Ideal Answer */}
                        <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 leading-relaxed">
                          <span className="font-bold text-slate-100 block mb-1">
                            Referensi Jawaban Ideal & Rubrik:
                          </span>
                          <p>{essay.sampleAnswer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
