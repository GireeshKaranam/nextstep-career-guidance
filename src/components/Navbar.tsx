import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import type { ViewId } from '@/types';
import { Compass, GraduationCap, Heart, Calculator, Award, Route, MessageSquare, HeartHandshake, User, Menu, X, Globe } from 'lucide-react';

const navItems: { id: ViewId; key: keyof ReturnType<typeof useApp>['t']['nav'] }[] = [
  { id: 'stream', key: 'stream' },
  { id: 'courses', key: 'courses' },
  { id: 'passion', key: 'passion' },
  { id: 'calculator', key: 'calculator' },
  { id: 'scholarships', key: 'scholarships' },
  { id: 'careers', key: 'careers' },
  { id: 'mentors', key: 'mentors' },
  { id: 'parent', key: 'parent' },
  { id: 'profile', key: 'profile' },
];

const icons: Record<string, typeof Compass> = {
  stream: Compass,
  courses: GraduationCap,
  passion: Heart,
  calculator: Calculator,
  scholarships: Award,
  careers: Route,
  mentors: MessageSquare,
  parent: HeartHandshake,
  profile: User,
};

export function Navbar() {
  const { t, view, setView, lang, setLang, parentMode, setParentMode } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (v: ViewId) => {
    setView(v);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/85 backdrop-blur-md border-b border-ink-100 shadow-soft' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => go('home')} className="flex items-center gap-2 group">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-ocean-600 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </span>
            <span className="font-display text-lg font-700 text-ink-900">{t.brand}</span>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = icons[item.id] ?? Compass;
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.nav[item.key]}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-ink-700 hover:bg-ink-100 transition"
              title="Switch language"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === 'en' ? 'हिं' : 'EN'}</span>
            </button>
            <button
              onClick={() => {
                setParentMode(!parentMode);
                if (!parentMode) go('parent');
              }}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                parentMode ? 'bg-coral-100 text-coral-700' : 'text-ink-600 hover:bg-ink-100'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              {t.nav.parent}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg text-ink-700 hover:bg-ink-100 transition"
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden pb-4 animate-fade-up">
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map(item => {
                const Icon = icons[item.id] ?? Compass;
                const active = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                      active ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.nav[item.key]}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
