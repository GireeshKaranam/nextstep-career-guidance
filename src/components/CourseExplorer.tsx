import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { courses, allStates, allExams } from '@/data/courses';
import type { Course, SavedItem } from '@/types';
import { GraduationCap, Search, Bookmark, BookmarkCheck, ArrowRight, X, MapPin, Building2, IndianRupee, TrendingUp, Filter } from 'lucide-react';

type Mode = 'continue' | 'switch';

export function CourseExplorer() {
  const { t, lang, toggleSave, isSaved, addCompareCourse, setView, quizResults } = useApp();
  const [mode, setMode] = useState<Mode>('continue');
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [feeFilter, setFeeFilter] = useState('all');
  const [examFilter, setExamFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const userStream = quizResults[0]?.topStream ?? 'pcm';

  const filtered = useMemo(() => {
    return courses.filter(c => {
      if (mode === 'continue' && c.stream !== 'any' && c.stream !== userStream) return false;
      if (mode === 'switch' && !c.switchable) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.institutions.join(' ').toLowerCase().includes(search.toLowerCase())) return false;
      if (stateFilter !== 'all' && !c.states.includes(stateFilter)) return false;
      if (examFilter !== 'all' && !c.entranceExams.includes(examFilter)) return false;
      if (typeFilter !== 'all' && c.institutionType !== typeFilter) return false;
      if (feeFilter !== 'all') {
        if (feeFilter === 'u50' && c.feesAnnual >= 50000) return false;
        if (feeFilter === '50-200' && (c.feesAnnual < 50000 || c.feesAnnual > 200000)) return false;
        if (feeFilter === '200-500' && (c.feesAnnual < 200000 || c.feesAnnual > 500000)) return false;
        if (feeFilter === '500+' && c.feesAnnual < 500000) return false;
      }
      return true;
    });
  }, [mode, userStream, search, stateFilter, feeFilter, examFilter, typeFilter]);

  const clearFilters = () => {
    setSearch(''); setStateFilter('all'); setFeeFilter('all'); setExamFilter('all'); setTypeFilter('all');
  };

  const save = (c: Course) => {
    const item: SavedItem = { id: `course-${c.id}`, type: 'course', title: lang === 'hi' ? c.nameHi : c.name, subtitle: c.institutions[0], savedAt: Date.now() };
    toggleSave(item);
  };

  const sendToCalc = (c: Course) => {
    addCompareCourse(c.id);
    setView('calculator');
  };

  const feeOptions = [
    { id: 'all', label: t.common.clearAll },
    { id: 'u50', label: t.courses.feesUnder50 },
    { id: '50-200', label: t.courses.fees50to2 },
    { id: '200-500', label: t.courses.fees2to5 },
    { id: '500+', label: t.courses.feesAbove5 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-up">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-ocean-600 flex items-center justify-center text-white mx-auto mb-4 shadow-soft">
          <GraduationCap className="w-7 h-7" />
        </div>
        <h1 className="section-title">{t.courses.title}</h1>
        <p className="section-sub mx-auto text-center">{t.courses.sub}</p>
      </div>

      {/* Mode toggle */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setMode('continue')}
          className={`card p-4 text-left transition-all ${mode === 'continue' ? 'border-brand-400 shadow-glow' : 'hover:border-ink-200'}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <ArrowRight className="w-4 h-4 text-brand-600" />
            <span className="font-700 text-ink-900">{t.courses.continuePath}</span>
          </div>
          <p className="text-xs text-ink-500">{t.courses.continueDesc}</p>
        </button>
        <button
          onClick={() => setMode('switch')}
          className={`card p-4 text-left transition-all ${mode === 'switch' ? 'border-ocean-400 shadow-glow' : 'hover:border-ink-200'}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-ocean-600" />
            <span className="font-700 text-ink-900">{t.courses.switchLanes}</span>
          </div>
          <p className="text-xs text-ink-500">{t.courses.switchDesc}</p>
        </button>
      </div>

      {/* Filters */}
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-ink-400" />
          <span className="font-semibold text-sm text-ink-700">{t.common.filters}</span>
          <button onClick={clearFilters} className="ml-auto text-xs text-brand-600 font-semibold hover:underline">{t.common.clearAll}</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input className="input pl-9" placeholder={t.courses.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input" value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
            <option value="all">{t.courses.anyState}</option>
            {allStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="input" value={examFilter} onChange={e => setExamFilter(e.target.value)}>
            <option value="all">{t.courses.anyExam}</option>
            {allExams.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select className="input" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="all">{t.courses.anyType}</option>
            <option value="govt">{t.courses.govt}</option>
            <option value="private">{t.courses.private}</option>
            <option value="deemed">{t.courses.deemed}</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {feeOptions.map(f => (
            <button
              key={f.id}
              onClick={() => setFeeFilter(f.id)}
              className={`chip ${feeFilter === f.id ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-ink-600 border-ink-200 hover:border-ink-300'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-ink-500 mb-4">{filtered.length} {t.common.results}</div>

      {/* Course cards */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-ink-400">{t.common.noResults}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(c => {
            const saved = isSaved(`course-${c.id}`);
            const isExp = expanded === c.id;
            return (
              <div key={c.id} className="card card-hover p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{c.emoji}</span>
                    <div>
                      <h3 className="font-700 text-ink-900">{lang === 'hi' ? c.nameHi : c.name}</h3>
                      <span className="text-xs text-ink-400">{c.duration}</span>
                    </div>
                  </div>
                  <button onClick={() => save(c)} className="p-1.5 rounded-lg hover:bg-ink-100 transition">
                    {saved ? <BookmarkCheck className="w-5 h-5 text-brand-600" /> : <Bookmark className="w-5 h-4 text-ink-400" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-ink-500">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span className="font-semibold text-ink-800">₹{(c.feesAnnual / 1000).toFixed(0)}k</span>/yr
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-ink-500">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="font-semibold text-ink-800">₹{(c.startingSalary / 100000).toFixed(0)}L</span> start
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {c.entranceExams.map(e => (
                    <span key={e} className="chip bg-ocean-50 text-ocean-700 border-ocean-100 text-[10px]">{e}</span>
                  ))}
                  <span className={`chip text-[10px] ${c.institutionType === 'govt' ? 'bg-brand-50 text-brand-700 border-brand-100' : 'bg-gold-50 text-gold-700 border-gold-100'}`}>
                    {c.institutionType === 'govt' ? t.courses.govt : c.institutionType === 'private' ? t.courses.private : t.courses.deemed}
                  </span>
                </div>

                {c.switchable && mode === 'switch' && c.switchNotes && (
                  <div className="mb-3 p-2.5 rounded-lg bg-gold-50 border border-gold-100 text-xs text-gold-800">
                    <strong>{t.courses.switchNote}:</strong> {lang === 'hi' ? c.switchNotes : c.switchNotes}
                  </div>
                )}

                <button onClick={() => setExpanded(isExp ? null : c.id)} className="text-xs font-semibold text-brand-700 hover:underline">
                  {isExp ? t.common.hideDetails : t.common.viewDetails}
                </button>

                {isExp && (
                  <div className="mt-3 pt-3 border-t border-ink-100 space-y-3 animate-fade-up">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-500 mb-1"><Building2 className="w-3.5 h-3.5" />{t.courses.institutions}</div>
                      <div className="text-sm text-ink-700">{c.institutions.join(', ')}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-500 mb-1"><MapPin className="w-3.5 h-3.5" />{t.courses.state}</div>
                      <div className="flex flex-wrap gap-1">
                        {c.states.map(s => <span key={s} className="chip bg-ink-50 text-ink-600 border-ink-100 text-[10px]">{s}</span>)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-ink-500">{t.courses.growthSalary}: <strong className="text-ink-800">₹{(c.growthSalary / 100000).toFixed(0)}L</strong></span>
                    </div>
                    <button onClick={() => sendToCalc(c)} className="btn-secondary w-full text-xs">
                      <ArrowRight className="w-3.5 h-3.5" />
                      {t.common.sendToCalculator}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
