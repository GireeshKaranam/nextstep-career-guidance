import { useApp } from '@/context/AppContext';
import type { ViewId } from '@/types';
import { Compass, Github, Heart } from 'lucide-react';

const links: { id: ViewId; labelKey: string }[] = [
  { id: 'stream', labelKey: 'stream' },
  { id: 'courses', labelKey: 'courses' },
  { id: 'passion', labelKey: 'passion' },
  { id: 'calculator', labelKey: 'calculator' },
  { id: 'scholarships', labelKey: 'scholarships' },
  { id: 'careers', labelKey: 'careers' },
  { id: 'mentors', labelKey: 'mentors' },
  { id: 'parent', labelKey: 'parent' },
];

export function Footer() {
  const { t, setView } = useApp();
  return (
    <footer className="mt-20 border-t border-ink-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-ocean-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </span>
              <span className="font-display text-lg font-700 text-ink-900">{t.brand}</span>
            </div>
            <p className="text-sm text-ink-500 leading-relaxed">{t.tagline}</p>
          </div>

          <div>
            <h4 className="font-700 text-ink-900 text-sm mb-3">Quick links</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {links.map(l => (
                <button
                  key={l.id}
                  onClick={() => {
                    setView(l.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-sm text-ink-500 hover:text-brand-700 transition text-left"
                >
                  {t.nav[l.labelKey as keyof typeof t.nav]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-700 text-ink-900 text-sm mb-3">{t.footer.madeFor}</h4>
            <p className="text-sm text-ink-500 leading-relaxed">{t.footer.line}</p>
            <div className="flex items-center gap-2 mt-4 text-xs text-ink-400">
              <Heart className="w-3.5 h-3.5 text-coral-500" />
              <span>NextStep {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
