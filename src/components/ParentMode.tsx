import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { parentMyths, parentCourseNotes } from '@/data/parentMode';
import { courses } from '@/data/courses';
import { streams } from '@/data/streams';
import { scholarships } from '@/data/scholarships';
import { HeartHandshake, Shield, CheckCircle2, X, AlertTriangle, Printer, FileText, Award } from 'lucide-react';

export function ParentMode() {
  const { t, lang, setParentMode, saved, quizResults, setView } = useApp();
  const [showReport, setShowReport] = useState(false);

  const savedCourses = saved.filter(s => s.type === 'course');
  const savedScholarships = saved.filter(s => s.type === 'scholarship');
  const topStream = quizResults[0] ? streams[quizResults[0].topStream] : null;
  const budget = savedCourses
    .map(s => courses.find(c => `course-${c.id}` === s.id))
    .filter(Boolean)
    .reduce((sum, c) => sum + (c ? c.feesAnnual * 4 : 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-up">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-coral-500 flex items-center justify-center text-white mx-auto mb-4 shadow-soft">
          <HeartHandshake className="w-7 h-7" />
        </div>
        <h1 className="section-title">{t.parent.title}</h1>
        <p className="section-sub mx-auto text-center">{t.parent.sub}</p>
      </div>

      {/* Myth vs Reality */}
      <div className="mb-10">
        <h2 className="font-display text-2xl font-700 text-ink-900 mb-5">{t.parent.mythVsReality}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {parentMyths.map(m => (
            <div key={m.id} className="card p-5">
              <div className="flex items-start gap-2 mb-3 p-3 rounded-xl bg-coral-50 border border-coral-100">
                <X className="w-4 h-4 text-coral-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-700 text-coral-700 mb-0.5">{t.parent.myth}</div>
                  <p className="text-sm text-ink-800 font-semibold">{lang === 'hi' ? m.mythHi : m.myth}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 mb-3 p-3 rounded-xl bg-brand-50 border border-brand-100">
                <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-700 text-brand-700 mb-0.5">{t.parent.reality}</div>
                  <p className="text-sm text-ink-700">{lang === 'hi' ? m.realityHi : m.reality}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-xl bg-ink-50 border border-ink-100">
                <AlertTriangle className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-700 text-gold-700 mb-0.5">{t.parent.data}</div>
                  <p className="text-sm text-ink-600">{lang === 'hi' ? m.dataHi : m.data}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Recognition */}
      <div className="mb-10">
        <h2 className="font-display text-2xl font-700 text-ink-900 mb-5 flex items-center gap-2"><Shield className="w-5 h-5 text-ocean-600" />{t.parent.security}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {parentCourseNotes.map(n => {
            const course = courses.find(c => c.id === n.courseId);
            if (!course) return null;
            return (
              <div key={n.courseId} className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{course.emoji}</span>
                  <h4 className="font-700 text-ink-900 text-sm">{lang === 'hi' ? course.nameHi : course.name}</h4>
                </div>
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-semibold text-ink-500">{t.parent.recognition}:</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i < n.jobSecurity ? 'bg-brand-500' : 'bg-ink-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-ink-600">{lang === 'hi' ? n.recognitionHi : n.recognition}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-ink-50">
                  <div className="text-xs font-semibold text-ink-500 mb-0.5">{t.parent.safety}:</div>
                  <p className="text-xs text-ink-600">{lang === 'hi' ? n.safetyNoteHi : n.safetyNote}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Family Report */}
      <div className="text-center">
        <button onClick={() => setShowReport(true)} className="btn-primary text-base px-6 py-3.5">
          <FileText className="w-4 h-4" />
          {t.parent.generate}
        </button>
      </div>

      {/* Report modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4 no-print" onClick={() => setShowReport(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin shadow-card animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-ink-100 p-4 flex items-center justify-between no-print">
              <h3 className="font-700 text-ink-900">{t.parent.reportTitle}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="btn-secondary text-sm"><Printer className="w-4 h-4" />{t.parent.print}</button>
                <button onClick={() => setShowReport(false)} className="p-2 rounded-lg hover:bg-ink-100"><X className="w-5 h-5 text-ink-500" /></button>
              </div>
            </div>

            <div className="print-area p-6">
              <div className="text-center mb-6 pb-4 border-b-2 border-brand-500">
                <h2 className="font-display text-2xl font-700 text-ink-900">{t.parent.reportTitle}</h2>
                <p className="text-sm text-ink-500">{t.brand} · {new Date().toLocaleDateString()}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-700 text-ink-900 text-sm mb-1">{t.parent.shortlistedStream}</h4>
                  {topStream ? (
                    <div className="p-3 rounded-xl bg-brand-50 border border-brand-100">
                      <span className="text-2xl mr-2">{topStream.emoji}</span>
                      <span className="font-700 text-ink-900">{lang === 'hi' ? topStream.nameHi : topStream.name}</span>
                      <p className="text-xs text-ink-500 mt-1">{lang === 'hi' ? topStream.taglineHi : topStream.tagline}</p>
                    </div>
                  ) : <p className="text-sm text-ink-400">—</p>}
                </div>

                <div>
                  <h4 className="font-700 text-ink-900 text-sm mb-1">{t.parent.topCourses}</h4>
                  {savedCourses.length > 0 ? (
                    <div className="space-y-2">
                      {savedCourses.slice(0, 3).map(s => {
                        const c = courses.find(x => `course-${x.id}` === s.id);
                        return c ? (
                          <div key={s.id} className="p-2.5 rounded-lg bg-ink-50 flex items-center justify-between">
                            <span className="text-sm font-semibold text-ink-800">{c.emoji} {lang === 'hi' ? c.nameHi : c.name}</span>
                            <span className="text-xs text-ink-500">₹{(c.feesAnnual / 1000).toFixed(0)}k/yr</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : <p className="text-sm text-ink-400">—</p>}
                </div>

                <div>
                  <h4 className="font-700 text-ink-900 text-sm mb-1">{t.parent.estimatedBudget}</h4>
                  <p className="font-display text-xl font-700 text-gold-700">₹{(budget / 100000).toFixed(1)} L</p>
                </div>

                <div>
                  <h4 className="font-700 text-ink-900 text-sm mb-1">{t.parent.applicableScholarships}</h4>
                  {savedScholarships.length > 0 ? (
                    <div className="space-y-1">
                      {savedScholarships.map(s => (
                        <div key={s.id} className="flex items-center gap-2 text-sm text-ink-700">
                          <Award className="w-3.5 h-3.5 text-ocean-600" />{s.title}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {scholarships.slice(0, 3).map(s => (
                        <div key={s.id} className="flex items-center gap-2 text-sm text-ink-700">
                          <Award className="w-3.5 h-3.5 text-ocean-600" />{lang === 'hi' ? s.nameHi : s.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-brand-50 border border-brand-100">
                  <h4 className="font-700 text-brand-800 text-sm mb-1">{t.parent.notes}</h4>
                  <p className="text-sm text-ink-600">
                    {lang === 'hi'
                      ? 'इस सारांश को परिवार के साथ बैठकर चर्चा करें। अंतिम फ़ैसला छात्र की रुचि और परिवार की स्थिति दोनों देखकर लें।'
                      : 'Discuss this summary together as a family. The final decision should consider both the student\'s interests and the family\'s circumstances.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-ink-100 text-center no-print">
                <button onClick={() => { setShowReport(false); setView('stream'); }} className="text-xs text-brand-700 font-semibold hover:underline">
                  {t.nav.stream} →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
