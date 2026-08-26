import { useApp } from '@/context/AppContext';
import { streams } from '@/data/streams';
import { User, Bookmark, Compass, Trash2, Calendar, Award, Heart } from 'lucide-react';
import type { SavedItem } from '@/types';

export function StudentProfile() {
  const { t, lang, saved, toggleSave, clearSaved, quizResults, setView } = useApp();

  const typeIcons: Record<string, typeof Bookmark> = {
    course: Bookmark,
    scholarship: Award,
    career: Compass,
    passion: Heart,
    stream: Compass,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-up">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ink-700 to-ink-900 flex items-center justify-center text-white mx-auto mb-4 shadow-soft">
          <User className="w-7 h-7" />
        </div>
        <h1 className="section-title">{t.profile.title}</h1>
        <p className="section-sub mx-auto text-center">{t.profile.sub}</p>
      </div>

      {/* Quiz history */}
      <div className="card p-6 mb-6">
        <h3 className="font-700 text-ink-900 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-ocean-600" />{t.profile.quizHistory}</h3>
        {quizResults.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-ink-400 mb-3">{t.profile.noQuiz}</p>
            <button onClick={() => setView('stream')} className="btn-primary text-sm">{t.stream.startCta}</button>
          </div>
        ) : (
          <div className="space-y-2">
            {quizResults.map((r, i) => {
              const s = streams[r.topStream];
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-ink-50">
                  <span className="text-2xl">{s.emoji}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-ink-900 text-sm">{lang === 'hi' ? s.nameHi : s.name}</div>
                    <div className="text-xs text-ink-400">{new Date(r.date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-700 text-brand-600">{Math.round((r.scores[r.topStream] / Math.max(...Object.values(r.scores), 1)) * 100)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Saved items */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-700 text-ink-900 flex items-center gap-2"><Bookmark className="w-4 h-4 text-brand-600" />{t.profile.savedItems}</h3>
          {saved.length > 0 && (
            <button onClick={clearSaved} className="text-xs text-coral-600 font-semibold hover:underline flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" />
              {t.profile.clearAll}
            </button>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-ink-400 mb-3">{t.profile.empty}</p>
            <button onClick={() => setView('courses')} className="btn-secondary text-sm">{t.common.explore} →</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {saved.map((item: SavedItem) => {
              const Icon = typeIcons[item.type] ?? Bookmark;
              return (
                <div key={item.id} className="p-3 rounded-xl bg-ink-50 border border-ink-100 flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white border border-ink-200 flex items-center justify-center text-brand-600 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink-900 text-sm truncate">{item.title}</div>
                    <div className="text-xs text-ink-400 truncate">{item.subtitle}</div>
                  </div>
                  <button onClick={() => toggleSave(item)} className="p-1 rounded hover:bg-ink-200 transition opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-3.5 h-3.5 text-ink-400" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
