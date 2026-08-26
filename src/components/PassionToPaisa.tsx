import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { passions } from '@/data/passions';
import type { PassionTrack, SavedItem } from '@/types';
import { Heart, Bookmark, BookmarkCheck, TrendingUp, Clock, Award, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function PassionToPaisa() {
  const { t, lang, toggleSave, isSaved } = useApp();
  const [selected, setSelected] = useState<PassionTrack | null>(null);

  const save = (p: PassionTrack) => {
    const item: SavedItem = { id: `passion-${p.id}`, type: 'passion', title: lang === 'hi' ? p.titleHi : p.title, subtitle: lang === 'hi' ? p.taglineHi : p.tagline, savedAt: Date.now() };
    toggleSave(item);
  };

  if (selected) {
    const saved = isSaved(`passion-${selected.id}`);
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-up">
        <button onClick={() => setSelected(null)} className="btn-ghost mb-6 text-sm">
          ← {t.common.back}
        </button>

        <div className="card p-7 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selected.emoji}</span>
              <div>
                <h1 className="font-display text-2xl font-700 text-ink-900">{lang === 'hi' ? selected.titleHi : selected.title}</h1>
                <p className="text-sm text-ink-500">{lang === 'hi' ? selected.taglineHi : selected.tagline}</p>
              </div>
            </div>
            <button onClick={() => save(selected)} className="btn-secondary text-sm shrink-0">
              {saved ? <BookmarkCheck className="w-4 h-4 text-brand-600" /> : <Bookmark className="w-4 h-4" />}
              {saved ? t.common.saved : t.common.save}
            </button>
          </div>
        </div>

        {/* Formats */}
        <div className="card p-6 mb-4">
          <h3 className="font-700 text-ink-900 mb-4">{t.passion.formats}</h3>
          <div className="grid gap-3">
            {selected.formats.map((f, i) => (
              <div key={i} className="p-4 rounded-xl bg-ink-50 border border-ink-100">
                <h4 className="font-semibold text-ink-900 text-sm mb-1">{lang === 'hi' ? f.nameHi : f.name}</h4>
                <p className="text-sm text-ink-500">{lang === 'hi' ? f.descHi : f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Income milestones */}
        <div className="card p-6 mb-4">
          <h3 className="font-700 text-ink-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-brand-600" />{t.passion.income}</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {selected.income.map((inc, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-gradient-to-br from-brand-50 to-ocean-50 border border-brand-100">
                <div className="text-xs text-ink-500 font-semibold mb-1">{lang === 'hi' ? inc.stageHi : inc.stage}</div>
                <div className="font-display text-lg font-700 text-brand-700">{inc.range}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Certs */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="card p-6">
            <h3 className="font-700 text-ink-900 mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-600" />{t.passion.skills}</h3>
            <div className="flex flex-wrap gap-2">
              {selected.skills.map(s => <span key={s} className="chip bg-brand-50 text-brand-700 border-brand-100">{s}</span>)}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-700 text-ink-900 mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-gold-600" />{t.passion.certs}</h3>
            <div className="flex flex-wrap gap-2">
              {selected.certifications.map(c => <span key={c} className="chip bg-gold-50 text-gold-700 border-gold-100">{c}</span>)}
            </div>
          </div>
        </div>

        {/* Role models */}
        <div className="card p-6 mb-4">
          <h3 className="font-700 text-ink-900 mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-ocean-600" />{t.passion.roleModels}</h3>
          <div className="flex flex-wrap gap-2">
            {selected.roleModels.map(r => <span key={r} className="chip bg-ocean-50 text-ocean-700 border-ocean-100">{r}</span>)}
          </div>
        </div>

        {/* Reality check */}
        <div className="card p-6 mb-4 border-coral-200 bg-coral-50/40">
          <h3 className="font-700 text-ink-900 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-coral-600" />{t.passion.reality}</h3>
          <p className="text-sm text-ink-600 leading-relaxed mb-4">{lang === 'hi' ? selected.realityCheckHi : selected.realityCheck}</p>
          <div className="flex items-center gap-2 text-sm text-ink-700">
            <Clock className="w-4 h-4 text-ink-400" />
            <span className="font-semibold">{t.passion.rampUp}:</span>
            <span className="text-ink-600">{selected.rampUp}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-up">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral-500 to-coral-700 flex items-center justify-center text-white mx-auto mb-4 shadow-soft">
          <Heart className="w-7 h-7" />
        </div>
        <h1 className="section-title">{t.passion.title}</h1>
        <p className="section-sub mx-auto text-center">{t.passion.sub}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {passions.map(p => {
          const saved = isSaved(`passion-${p.id}`);
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="card card-hover p-5 text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl group-hover:scale-110 transition-transform">{p.emoji}</span>
                {saved && <BookmarkCheck className="w-5 h-5 text-brand-600" />}
              </div>
              <h3 className="font-700 text-ink-900 mb-1">{lang === 'hi' ? p.titleHi : p.title}</h3>
              <p className="text-sm text-ink-500">{lang === 'hi' ? p.taglineHi : p.tagline}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-700">
                {t.common.explore} →
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
