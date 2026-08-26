import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { mentorReviews } from '@/data/mentorReviews';
import { careers } from '@/data/careers';
import type { MentorReview } from '@/types';
import { MessageSquare, Star, Plus, X, Quote, CheckCircle2, Clock } from 'lucide-react';

export function MentorReviews() {
  const { t, lang } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState<MentorReview[]>(mentorReviews);
  const [form, setForm] = useState({ name: '', role: '', years: '', careerId: careers[0].id, wish: '', day: '', pros: '', cons: '', advice: '' });
  const [submitted, setSubmitted] = useState(false);

  const approved = reviews.filter(r => r.approved);

  const submit = () => {
    if (!form.name || !form.advice) return;
    const newReview: MentorReview = {
      id: `m${Date.now()}`,
      careerId: form.careerId,
      name: form.name,
      role: form.role,
      roleHi: form.role,
      yearsExperience: Number(form.years) || 0,
      wishIKnew: form.wish,
      wishIKnewHi: form.wish,
      dayInLife: form.day,
      dayInLifeHi: form.day,
      pros: form.pros.split(',').map(s => s.trim()).filter(Boolean),
      cons: form.cons.split(',').map(s => s.trim()).filter(Boolean),
      topAdvice: form.advice,
      topAdviceHi: form.advice,
      approved: false,
      rating: 5,
    };
    setReviews(prev => [...prev, newReview]);
    setSubmitted(true);
    setForm({ name: '', role: '', years: '', careerId: careers[0].id, wish: '', day: '', pros: '', cons: '', advice: '' });
    setTimeout(() => { setSubmitted(false); setShowForm(false); }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-up">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-coral-600 to-gold-600 flex items-center justify-center text-white mx-auto mb-4 shadow-soft">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h1 className="section-title">{t.mentors.title}</h1>
        <p className="section-sub mx-auto text-center">{t.mentors.sub}</p>
      </div>

      <div className="text-center mb-6">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" />
          {t.mentors.submit}
        </button>
      </div>

      {submitted && (
        <div className="card p-4 mb-6 bg-brand-50 border-brand-200 text-center text-sm text-brand-700 font-semibold animate-scale-in">
          {t.mentors.thanks}
        </div>
      )}

      {/* Submission form */}
      {showForm && (
        <div className="card p-6 mb-8 animate-scale-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-700 text-ink-900">{t.mentors.submitTitle}</h3>
            <button onClick={() => setShowForm(false)} className="text-ink-400 hover:text-ink-700"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <input className="input" placeholder={t.mentors.name} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input className="input" placeholder={t.mentors.role} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
            <input className="input" type="number" placeholder={t.mentors.years} value={form.years} onChange={e => setForm({ ...form, years: e.target.value })} />
            <select className="input" value={form.careerId} onChange={e => setForm({ ...form, careerId: e.target.value })}>
              {careers.map(c => <option key={c.id} value={c.id}>{lang === 'hi' ? c.titleHi : c.title}</option>)}
            </select>
          </div>
          <textarea className="input mb-3 min-h-[80px]" placeholder={t.mentors.wish} value={form.wish} onChange={e => setForm({ ...form, wish: e.target.value })} />
          <textarea className="input mb-3 min-h-[80px]" placeholder={t.mentors.day} value={form.day} onChange={e => setForm({ ...form, day: e.target.value })} />
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <input className="input" placeholder={t.mentors.pros + ' (comma separated)'} value={form.pros} onChange={e => setForm({ ...form, pros: e.target.value })} />
            <input className="input" placeholder={t.mentors.cons + ' (comma separated)'} value={form.cons} onChange={e => setForm({ ...form, cons: e.target.value })} />
          </div>
          <textarea className="input mb-4 min-h-[80px]" placeholder={t.mentors.advice} value={form.advice} onChange={e => setForm({ ...form, advice: e.target.value })} />
          <button onClick={submit} className="btn-primary w-full">{t.common.submit}</button>
        </div>
      )}

      {/* Reviews list */}
      <div className="grid md:grid-cols-2 gap-4">
        {approved.map(m => {
          const career = careers.find(c => c.id === m.careerId);
          return (
            <div key={m.id} className="card card-hover p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-ocean-600 text-white flex items-center justify-center font-700">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-700 text-ink-900 text-sm">{m.name}</h4>
                    <span className="text-xs text-ink-500">{lang === 'hi' ? m.roleHi : m.role} · {m.yearsExperience} yr</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < m.rating ? 'text-gold-500 fill-gold-500' : 'text-ink-200'}`} />
                  ))}
                </div>
              </div>

              {career && (
                <span className="inline-flex items-center gap-1 chip bg-ink-50 text-ink-600 border-ink-100 text-[10px] mb-3">
                  {career.emoji} {lang === 'hi' ? career.titleHi : career.title}
                </span>
              )}

              <div className="mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-500 mb-1"><Quote className="w-3 h-3" />{t.mentors.wish}</div>
                <p className="text-sm text-ink-600 italic">"{lang === 'hi' ? m.wishIKnewHi : m.wishIKnew}"</p>
              </div>

              <div className="mb-3">
                <div className="text-xs font-semibold text-ink-500 mb-1">{t.mentors.day}</div>
                <p className="text-sm text-ink-600">{lang === 'hi' ? m.dayInLifeHi : m.dayInLife}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <div className="text-xs font-semibold text-brand-600 mb-1">{t.mentors.pros}</div>
                  {m.pros.map(p => <div key={p} className="flex items-center gap-1 text-xs text-ink-600"><CheckCircle2 className="w-3 h-3 text-brand-500" />{p}</div>)}
                </div>
                <div>
                  <div className="text-xs font-semibold text-coral-600 mb-1">{t.mentors.cons}</div>
                  {m.cons.map(c => <div key={c} className="flex items-center gap-1 text-xs text-ink-600"><X className="w-3 h-3 text-coral-500" />{c}</div>)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-brand-50 border border-brand-100">
                <div className="text-xs font-semibold text-brand-700 mb-1">{t.mentors.advice}</div>
                <p className="text-sm text-ink-700 font-500">"{lang === 'hi' ? m.topAdviceHi : m.topAdvice}"</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending reviews */}
      {reviews.filter(r => !r.approved).length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-sm text-ink-500 mb-3 flex items-center gap-2"><Clock className="w-4 h-4" />{t.mentors.pending}</h3>
          <div className="space-y-2">
            {reviews.filter(r => !r.approved).map(r => (
              <div key={r.id} className="card p-3 flex items-center gap-2 text-sm text-ink-400">
                <Clock className="w-4 h-4" />
                {r.name} — {r.role} (awaiting moderation)
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
