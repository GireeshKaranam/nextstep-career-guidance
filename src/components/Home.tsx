import { useApp } from '@/context/AppContext';
import type { ViewId } from '@/types';
import { Compass, GraduationCap, Heart, Calculator, Award, Route, MessageSquare, HeartHandshake, ArrowRight, Sparkles, Globe } from 'lucide-react';

const moduleMeta: { id: ViewId; titleKey: string; descKey: string; icon: typeof Compass; color: string }[] = [
  { id: 'stream', titleKey: 'm1', descKey: 'm1d', icon: Compass, color: 'from-ocean-500 to-ocean-700' },
  { id: 'courses', titleKey: 'm2', descKey: 'm2d', icon: GraduationCap, color: 'from-brand-500 to-brand-700' },
  { id: 'passion', titleKey: 'm3', descKey: 'm3d', icon: Heart, color: 'from-coral-500 to-coral-700' },
  { id: 'calculator', titleKey: 'm4', descKey: 'm4d', icon: Calculator, color: 'from-gold-500 to-gold-700' },
  { id: 'scholarships', titleKey: 'm5', descKey: 'm5d', icon: Award, color: 'from-ocean-500 to-brand-600' },
  { id: 'careers', titleKey: 'm6', descKey: 'm6d', icon: Route, color: 'from-brand-600 to-ocean-600' },
  { id: 'mentors', titleKey: 'm7', descKey: 'm7d', icon: MessageSquare, color: 'from-coral-600 to-gold-600' },
  { id: 'parent', titleKey: 'm8', descKey: 'm8d', icon: HeartHandshake, color: 'from-brand-500 to-coral-500' },
];

export function Home() {
  const { t, setView } = useApp();
  const go = (v: ViewId) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-ocean-200/40 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-700 border border-brand-200 mb-6 animate-scale-in">
              <Sparkles className="w-3.5 h-3.5" />
              {t.home.heroBadge}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-700 text-ink-900 leading-[1.1] tracking-tight text-balance">
              {t.home.heroTitle}
            </h1>
            <p className="mt-6 text-lg text-ink-500 leading-relaxed max-w-2xl">{t.home.heroSub}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button onClick={() => go('stream')} className="btn-primary text-base px-6 py-3.5 group">
                {t.home.ctaQuiz}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button onClick={() => go('courses')} className="btn-secondary text-base px-6 py-3.5">
                {t.home.ctaExplore}
              </button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { num: t.home.stat1, sub: t.home.stat1sub },
                { num: t.home.stat2, sub: t.home.stat2sub },
                { num: t.home.stat3, sub: t.home.stat3sub },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-display text-2xl font-700 text-ink-900">{s.num}</div>
                  <div className="text-sm text-ink-500">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-10">
          <h2 className="section-title">{t.home.modulesTitle}</h2>
          <p className="section-sub">{t.home.modulesSub}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {moduleMeta.map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => go(m.id)}
                className="card card-hover p-6 text-left group animate-fade-up"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-700 text-ink-900 text-lg mb-1.5">{t.home[m.titleKey as keyof typeof t.home]}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{t.home[m.descKey as keyof typeof t.home]}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.common.explore}
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Bilingual banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="card p-8 bg-gradient-to-br from-ink-900 to-ink-800 text-white border-0">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-5 h-5 text-brand-400" />
            <span className="text-brand-400 text-sm font-700">{t.home.m9}</span>
          </div>
          <p className="text-xl font-display font-semibold max-w-2xl leading-snug">{t.home.m9d}</p>
        </div>
      </section>
    </div>
  );
}
