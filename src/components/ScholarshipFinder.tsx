import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { scholarships, scholarshipStates, scholarshipCategories, scholarshipLevels } from '@/data/scholarships';
import type { Scholarship, SavedItem } from '@/types';
import { Award, Bookmark, BookmarkCheck, ExternalLink, Filter, MapPin, Users, IndianRupee, GraduationCap, Calendar, FileText, X } from 'lucide-react';

export function ScholarshipFinder() {
  const { t, lang, toggleSave, isSaved } = useApp();
  const [state, setState] = useState('all');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [girlsOnly, setGirlsOnly] = useState(false);
  const [pwd, setPwd] = useState(false);

  const filtered = useMemo(() => {
    return scholarships.filter(s => {
      if (state !== 'all' && !s.states.includes(state) && !s.states.includes('Central')) return false;
      if (category !== 'all' && !s.categories.includes(category)) return false;
      if (level !== 'all' && !s.courseLevel.includes(level)) return false;
      if (girlsOnly && s.gender !== 'girls') return false;
      if (pwd && !s.pwd) return false;
      return true;
    });
  }, [state, category, level, girlsOnly, pwd]);

  const save = (s: Scholarship) => {
    const item: SavedItem = { id: `scholarship-${s.id}`, type: 'scholarship', title: lang === 'hi' ? s.nameHi : s.name, subtitle: s.amount, savedAt: Date.now() };
    toggleSave(item);
  };

  const clear = () => { setState('all'); setCategory('all'); setLevel('all'); setGirlsOnly(false); setPwd(false); };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-up">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ocean-500 to-brand-600 flex items-center justify-center text-white mx-auto mb-4 shadow-soft">
          <Award className="w-7 h-7" />
        </div>
        <h1 className="section-title">{t.scholarships.title}</h1>
        <p className="section-sub mx-auto text-center">{t.scholarships.sub}</p>
      </div>

      {/* Filters */}
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-ink-400" />
          <span className="font-semibold text-sm text-ink-700">{t.common.filters}</span>
          <button onClick={clear} className="ml-auto text-xs text-brand-600 font-semibold hover:underline">{t.common.clearAll}</button>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <select className="input" value={state} onChange={e => setState(e.target.value)}>
            <option value="all">{t.scholarships.anyGender === 'सभी' ? 'सभी राज्य' : 'All states'}</option>
            {scholarshipStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="all">{t.scholarships.anyCategory}</option>
            {scholarshipCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input" value={level} onChange={e => setLevel(e.target.value)}>
            <option value="all">{t.scholarships.anyLevel}</option>
            {scholarshipLevels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setGirlsOnly(!girlsOnly)} className={`chip ${girlsOnly ? 'bg-coral-600 text-white border-coral-600' : 'bg-white text-ink-600 border-ink-200'}`}>
            <Users className="w-3 h-3" />
            {t.scholarships.girlsOnly}
          </button>
          <button onClick={() => setPwd(!pwd)} className={`chip ${pwd ? 'bg-ocean-600 text-white border-ocean-600' : 'bg-white text-ink-600 border-ink-200'}`}>
            {t.scholarships.pwd}
          </button>
        </div>
      </div>

      <div className="text-sm text-ink-500 mb-4">{filtered.length} {t.common.results}</div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-ink-400">{t.common.noResults}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(s => {
            const saved = isSaved(`scholarship-${s.id}`);
            return (
              <div key={s.id} className="card card-hover p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{s.emoji}</span>
                    <div>
                      <h3 className="font-700 text-ink-900 text-sm leading-tight">{lang === 'hi' ? s.nameHi : s.name}</h3>
                      <span className="text-xs text-ink-400">{s.provider}</span>
                    </div>
                  </div>
                  <button onClick={() => save(s)} className="p-1.5 rounded-lg hover:bg-ink-100 transition shrink-0">
                    {saved ? <BookmarkCheck className="w-5 h-5 text-brand-600" /> : <Bookmark className="w-5 h-5 text-ink-400" />}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-ink-500">
                    <IndianRupee className="w-3.5 h-3.5 text-brand-600" />
                    <span className="font-semibold text-ink-800">{s.amount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-ink-500">
                    <Calendar className="w-3.5 h-3.5 text-coral-600" />
                    <span className="font-semibold text-ink-800">{s.deadline}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {s.categories.slice(0, 4).map(c => <span key={c} className="chip bg-brand-50 text-brand-700 border-brand-100 text-[10px]">{c}</span>)}
                  {s.gender === 'girls' && <span className="chip bg-coral-50 text-coral-700 border-coral-100 text-[10px]">{t.scholarships.girlsOnly}</span>}
                  {s.pwd && <span className="chip bg-ocean-50 text-ocean-700 border-ocean-100 text-[10px]">{t.scholarships.pwd}</span>}
                </div>

                <div className="text-xs text-ink-500 mb-2">
                  <span className="font-semibold text-ink-700">{t.scholarships.income}:</span> {s.incomeLimit}
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-500 mb-1"><FileText className="w-3.5 h-3.5" />{t.scholarships.documents}</div>
                  <div className="flex flex-wrap gap-1">
                    {s.documents.map(d => <span key={d} className="chip bg-ink-50 text-ink-600 border-ink-100 text-[10px]">{d}</span>)}
                  </div>
                </div>

                <a href={s.url} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full text-xs">
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t.scholarships.apply}
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
