import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { quizQuestions } from '@/data/quizQuestions';
import { streams } from '@/data/streams';
import type { StreamId, QuizResult, SavedItem } from '@/types';
import { Compass, ArrowLeft, ArrowRight, RotateCcw, Bookmark, BookmarkCheck, Share2, BookOpen, Wrench, Lightbulb, CheckCircle2 } from 'lucide-react';

const pillarIcons = { academic: BookOpen, work_style: Wrench, scenario: Lightbulb };

export function StreamSelector() {
  const { t, lang, addQuizResult, toggleSave, isSaved, setView } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const total = quizQuestions.length;
  const q = quizQuestions[step];
  const progress = Math.round(((step + (showResults ? 1 : 0)) / total) * 100);

  const scores = useMemo(() => {
    const s: Record<StreamId, number> = { pcm: 0, pcb: 0, commerce_math: 0, commerce: 0, arts: 0, vocational: 0 };
    for (const qid in answers) {
      const opt = quizQuestions.find(qx => qx.id === qid)?.options.find(o => o.id === answers[qid]);
      if (opt) for (const k in opt.scores) s[k as StreamId] += opt.scores[k as StreamId] ?? 0;
    }
    return s;
  }, [answers]);

  const ranked = useMemo(() => {
    const max = Math.max(...Object.values(scores), 1);
    return (Object.keys(streams) as StreamId[])
      .map(id => ({ id, info: streams[id], score: scores[id], pct: Math.round((scores[id] / max) * 100) }))
      .sort((a, b) => b.pct - a.pct);
  }, [scores]);

  const top = ranked[0];

  const select = (qid: string, oid: string) => {
    setAnswers(prev => ({ ...prev, [qid]: oid }));
    if (step < total - 1) setTimeout(() => setStep(s => s + 1), 200);
    else setTimeout(() => setShowResults(true), 200);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const saveResult = () => {
    if (!top) return;
    const result: QuizResult = { date: Date.now(), scores, topStream: top.id };
    addQuizResult(result);
    const item: SavedItem = { id: `stream-${top.id}`, type: 'stream', title: lang === 'hi' ? top.info.nameHi : top.info.name, subtitle: `${top.pct}% ${t.stream.match}`, savedAt: Date.now() };
    if (!isSaved(item.id)) toggleSave(item);
  };

  const share = () => {
    const text = `My top stream match: ${lang === 'hi' ? top.info.nameHi : top.info.name} (${top.pct}% match) — via NextStep`;
    if (navigator.share) navigator.share({ title: 'NextStep', text }).catch(() => {});
    else navigator.clipboard?.writeText(text);
  };

  // Intro screen
  if (step === 0 && Object.keys(answers).length === 0 && !showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-up">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-ocean-500 to-brand-600 flex items-center justify-center text-white mx-auto mb-5 shadow-glow">
            <Compass className="w-8 h-8" />
          </div>
          <h1 className="section-title">{t.stream.title}</h1>
          <p className="section-sub mx-auto text-center">{t.stream.sub}</p>
        </div>

        <div className="card p-8 mb-6">
          <h2 className="font-700 text-ink-900 text-lg mb-5 text-center">{t.stream.intro}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {(['academic', 'work_style', 'scenario'] as const).map((p, i) => {
              const Icon = pillarIcons[p];
              const label = p === 'academic' ? t.stream.pillarAcademic : p === 'work_style' ? t.stream.pillarWork : t.stream.pillarScenario;
              return (
                <div key={p} className="text-center p-4 rounded-2xl bg-ink-50 border border-ink-100">
                  <div className="w-10 h-10 rounded-xl bg-white border border-ink-200 flex items-center justify-center text-brand-600 mx-auto mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-ink-400 font-semibold mb-1">6 {t.common.question}</div>
                  <div className="text-sm font-semibold text-ink-800">{label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6 mb-8 bg-brand-50/50 border-brand-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-700 text-ink-900 text-sm mb-1">{t.stream.scoring}</h3>
              <p className="text-sm text-ink-500">{t.stream.scoringDesc}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button onClick={() => setStep(0)} className="btn-primary text-base px-8 py-3.5">
            {t.stream.startCta}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults && top) {
    const saved = isSaved(`stream-${top.id}`);
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-up">
        <h1 className="section-title text-center">{t.stream.yourStreams}</h1>
        <p className="section-sub mx-auto text-center mb-8">{t.stream.whyFitsDesc}</p>

        {/* Top match highlight */}
        <div className="card p-7 mb-6 border-brand-200 shadow-glow">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{top.info.emoji}</span>
              <div>
                <h2 className="font-display text-2xl font-700 text-ink-900">{lang === 'hi' ? top.info.nameHi : top.info.name}</h2>
                <p className="text-sm text-ink-500">{lang === 'hi' ? top.info.taglineHi : top.info.tagline}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-display text-3xl font-700 text-brand-600">{top.pct}%</div>
              <div className="text-xs text-ink-400 font-semibold">{t.stream.match}</div>
            </div>
          </div>
          <div className="w-full h-3 rounded-full bg-ink-100 overflow-hidden mb-5">
            <div className="h-full bg-gradient-to-r from-brand-500 to-ocean-500 rounded-full transition-all duration-1000" style={{ width: `${top.pct}%` }} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={saveResult} className="btn-secondary text-sm">
              {saved ? <BookmarkCheck className="w-4 h-4 text-brand-600" /> : <Bookmark className="w-4 h-4" />}
              {saved ? t.common.saved : t.common.save}
            </button>
            <button onClick={share} className="btn-secondary text-sm">
              <Share2 className="w-4 h-4" />
              {t.common.share}
            </button>
            <button onClick={restart} className="btn-ghost text-sm">
              <RotateCcw className="w-4 h-4" />
              {t.stream.retake}
            </button>
          </div>
        </div>

        {/* Why it fits */}
        <div className="card p-6 mb-6">
          <h3 className="font-700 text-ink-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-gold-500" />
            {t.stream.whyFits}
          </h3>
          <p className="text-sm text-ink-600 leading-relaxed mb-4">
            {lang === 'hi'
              ? `आपके जवाबों से पता चलता है कि आप ${top.info.nameHi} में सबसे ज़्यादा रुचि रखते हैं। आपकी सोच, काम करने का तरीका और समस्या-सुलझाने का अंदाज़ इस स्ट्रीम से मेल खाता है।`
              : `Your answers show the strongest inclination toward ${top.info.name}. Your thinking style, work preferences, and problem-solving approach all align with this stream.`}
          </p>
          <div className="flex flex-wrap gap-2">
            {top.info.subjects.map(s => (
              <span key={s} className="chip bg-ocean-50 text-ocean-700 border-ocean-100">{s}</span>
            ))}
          </div>
        </div>

        {/* All ranked streams */}
        <div className="space-y-3 mb-6">
          {ranked.map((r, i) => (
            <div key={r.id} className={`card p-4 flex items-center gap-4 ${i === 0 ? 'border-brand-200' : ''}`}>
              <span className="text-2xl">{r.info.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-ink-900 text-sm">{lang === 'hi' ? r.info.nameHi : r.info.name}</span>
                  <span className="text-sm font-700 text-ink-700">{r.pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-ink-100 overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full transition-all duration-700" style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Careers */}
        <div className="card p-6 mb-6">
          <h3 className="font-700 text-ink-900 mb-4">{t.stream.careersIn}</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {(lang === 'hi' ? top.info.careersHi : top.info.careers).map(c => (
              <div key={c} className="flex items-center gap-2 text-sm text-ink-600 p-2 rounded-lg bg-ink-50">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                {c}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button onClick={() => setView('courses')} className="btn-primary">
            {t.common.explore} {t.nav.courses}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Quiz screen
  const selected = answers[q.id];
  const Icon = pillarIcons[q.pillar];
  const pillarLabel = q.pillar === 'academic' ? t.stream.pillarAcademic : q.pillar === 'work_style' ? t.stream.pillarWork : t.stream.pillarScenario;
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-up">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-ink-500">{t.common.question} {step + 1} {t.common.of} {total}</span>
          <span className="text-sm font-700 text-brand-600">{progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-ink-100 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-500 to-ocean-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Pillar badge */}
      <div className="flex items-center gap-2 mb-5">
        <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5" />
        </span>
        <span className="text-xs font-semibold text-ink-500">{pillarLabel}</span>
      </div>

      {/* Question */}
      <div className="card p-7 mb-6">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink-900 leading-snug mb-6">
          {lang === 'hi' ? q.questionHi : q.question}
        </h2>
        <div className="space-y-2.5">
          {q.options.map(o => {
            const isSel = selected === o.id;
            return (
              <button
                key={o.id}
                onClick={() => select(q.id, o.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                  isSel
                    ? 'border-brand-500 bg-brand-50 shadow-soft'
                    : 'border-ink-100 hover:border-ink-200 hover:bg-ink-50'
                }`}
              >
                <span className={`w-5 h-5 rounded-full border-2 shrink-0 transition-all ${
                  isSel ? 'border-brand-600 bg-brand-600' : 'border-ink-300'
                }`}>
                  {isSel && <span className="w-full h-full rounded-full bg-white scale-50 block" />}
                </span>
                <span className="text-sm font-500 text-ink-800">{lang === 'hi' ? o.textHi : o.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-ghost"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.common.back}
        </button>
        <span className="text-sm text-ink-400">{step + 1} / {total}</span>
        {step < total - 1 ? (
          <button
            onClick={() => setStep(s => Math.min(total - 1, s + 1))}
            disabled={!selected}
            className="btn-primary"
          >
            {t.common.next}
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setShowResults(true)}
            disabled={!selected}
            className="btn-primary"
          >
            {t.common.finish}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
