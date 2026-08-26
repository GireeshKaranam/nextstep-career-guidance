import { useApp } from '@/context/AppContext';
import { careers } from '@/data/careers';
import { mentorReviews } from '@/data/mentorReviews';
import { Route, ArrowRight, ArrowDown, TrendingUp, GitBranch, Star, MessageSquare } from 'lucide-react';

export function CareerSimulator() {
  const { t, lang, selectedCareerId, setSelectedCareerId, setView } = useApp();
  const career = careers.find(c => c.id === selectedCareerId) ?? careers[0];
  const mentors = mentorReviews.filter(r => r.careerId === career.id && r.approved);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-up">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-ocean-600 flex items-center justify-center text-white mx-auto mb-4 shadow-soft">
          <Route className="w-7 h-7" />
        </div>
        <h1 className="section-title">{t.careers.title}</h1>
        <p className="section-sub mx-auto text-center">{t.careers.sub}</p>
      </div>

      {/* Career picker */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {careers.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCareerId(c.id)}
              className={`chip ${c.id === career.id ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-ink-600 border-ink-200 hover:border-ink-300'}`}
            >
              <span>{c.emoji}</span>
              {lang === 'hi' ? c.titleHi : c.title}
            </button>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="card p-6 mb-6">
        <h3 className="font-700 text-ink-900 mb-5 flex items-center gap-2">
          <Route className="w-4 h-4 text-brand-600" />
          {t.careers.roadmap}
        </h3>
        <div className="relative">
          {career.stages.map((s, i) => (
            <div key={i} className="flex gap-4 pb-6 last:pb-0 relative">
              {/* Line */}
              {i < career.stages.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-brand-300 to-ocean-200" />
              )}
              {/* Dot */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-ocean-600 text-white flex items-center justify-center font-700 text-sm shrink-0 z-10 shadow-soft">
                {i + 1}
              </div>
              {/* Content */}
              <div className="pt-1.5 flex-1">
                <h4 className="font-700 text-ink-900 text-sm">{lang === 'hi' ? s.stageHi : s.stage}</h4>
                <p className="text-sm text-ink-500 mt-0.5">{lang === 'hi' ? s.detailHi : s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Salary growth */}
      <div className="card p-6 mb-6">
        <h3 className="font-700 text-ink-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-brand-600" />{t.careers.salaryGrowth}</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-ink-50 border border-ink-100 text-center">
            <div className="text-xs text-ink-500 font-semibold mb-1">{t.careers.start}</div>
            <div className="font-display text-lg font-700 text-ink-900">{career.salaryStart}</div>
          </div>
          <div className="p-4 rounded-xl bg-brand-50 border border-brand-100 text-center">
            <div className="text-xs text-brand-600 font-semibold mb-1">{t.careers.mid}</div>
            <div className="font-display text-lg font-700 text-brand-700">{career.salaryMid}</div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-brand-50 to-ocean-50 border border-brand-100 text-center">
            <div className="text-xs text-ink-500 font-semibold mb-1">{t.careers.peak}</div>
            <div className="font-display text-lg font-700 text-ocean-700">{career.salaryPeak}</div>
          </div>
        </div>
      </div>

      {/* Alternates */}
      <div className="card p-6 mb-6">
        <h3 className="font-700 text-ink-900 mb-4 flex items-center gap-2"><GitBranch className="w-4 h-4 text-ocean-600" />{t.careers.alternates}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {career.alternates.map((alt, i) => (
            <div key={i} className="p-4 rounded-xl bg-ocean-50/50 border border-ocean-100">
              <h4 className="font-700 text-ink-900 text-sm mb-3 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-ocean-600" />
                {lang === 'hi' ? alt.routeHi : alt.route}
              </h4>
              <div className="space-y-2">
                {alt.steps.map((step, j) => (
                  <div key={j} className="flex items-start gap-2 text-sm text-ink-600">
                    <span className="w-5 h-5 rounded-full bg-ocean-100 text-ocean-700 text-xs font-700 flex items-center justify-center shrink-0 mt-0.5">{j + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentor reviews */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-700 text-ink-900 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-coral-600" />{t.careers.mentorsFor}</h3>
          <button onClick={() => setView('mentors')} className="text-xs font-semibold text-brand-700 hover:underline">{t.mentors.submit} →</button>
        </div>
        {mentors.length === 0 ? (
          <p className="text-sm text-ink-400">{t.careers.noMentors}</p>
        ) : (
          <div className="space-y-3">
            {mentors.map(m => (
              <div key={m.id} className="p-4 rounded-xl bg-ink-50 border border-ink-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-700 text-ink-900 text-sm">{m.name}</span>
                    <span className="text-xs text-ink-500 ml-2">{lang === 'hi' ? m.roleHi : m.role}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < m.rating ? 'text-gold-500 fill-gold-500' : 'text-ink-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-ink-600 italic">"{lang === 'hi' ? m.topAdviceHi : m.topAdvice}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
