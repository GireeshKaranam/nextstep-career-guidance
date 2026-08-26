import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { courses } from '@/data/courses';
import { Calculator, IndianRupee, TrendingUp, Clock, Plus, X, Scale } from 'lucide-react';

function fmt(n: number) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

export function CostCalculator() {
  const { t, lang, calculatorCourseId, setCalculatorCourseId, compareCourses, addCompareCourse, removeCompareCourse } = useApp();
  const [tuition, setTuition] = useState(250000);
  const [hostel, setHostel] = useState(120000);
  const [books, setBooks] = useState(40000);
  const [examFees, setExamFees] = useState(15000);
  const [duration, setDuration] = useState(4);

  const [loanAmount, setLoanAmount] = useState(1000000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(10);
  const [moratorium, setMoratorium] = useState(1);

  const course = courses.find(c => c.id === calculatorCourseId) ?? courses[0];

  const totalCost = useMemo(() => (tuition + hostel + books + examFees) * duration, [tuition, hostel, books, examFees, duration]);
  const breakEven = useMemo(() => totalCost / (course.startingSalary || 1), [totalCost, course]);
  const roi = useMemo(() => ((course.growthSalary * 5 - totalCost) / totalCost) * 100, [course, totalCost]);

  const emi = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    const totalMonths = n + moratorium * 12;
    if (r === 0) return loanAmount / totalMonths;
    const emiBase = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return emiBase;
  }, [loanAmount, rate, tenure, moratorium]);

  const totalPayable = emi * tenure * 12;
  const totalInterest = totalPayable - loanAmount;

  const compareData = compareCourses.map(id => courses.find(c => c.id === id)).filter(Boolean) as typeof courses;

  const inputs = [
    { label: t.calculator.tuition, val: tuition, set: setTuition, min: 0, max: 1000000, step: 10000 },
    { label: t.calculator.hostel, val: hostel, set: setHostel, min: 0, max: 300000, step: 5000 },
    { label: t.calculator.books, val: books, set: setBooks, min: 0, max: 100000, step: 5000 },
    { label: t.calculator.examFees, val: examFees, set: setExamFees, min: 0, max: 50000, step: 1000 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-up">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-white mx-auto mb-4 shadow-soft">
          <Calculator className="w-7 h-7" />
        </div>
        <h1 className="section-title">{t.calculator.title}</h1>
        <p className="section-sub mx-auto text-center">{t.calculator.sub}</p>
      </div>

      {/* Course selector */}
      <div className="card p-5 mb-6">
        <label className="text-sm font-semibold text-ink-700 mb-2 block">{t.calculator.pickCourse}</label>
        <select
          className="input"
          value={calculatorCourseId}
          onChange={e => {
            setCalculatorCourseId(e.target.value);
            const c = courses.find(x => x.id === e.target.value);
            if (c) setTuition(c.feesAnnual);
          }}
        >
          {courses.map(c => <option key={c.id} value={c.id}>{lang === 'hi' ? c.nameHi : c.name}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Cost inputs */}
        <div className="card p-6">
          <h3 className="font-700 text-ink-900 mb-4 flex items-center gap-2"><IndianRupee className="w-4 h-4 text-gold-600" />{t.calculator.totalCost}</h3>
          <div className="space-y-4">
            {inputs.map((inp, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-ink-600">{inp.label}</span>
                  <span className="font-700 text-ink-900">{fmt(inp.val)}</span>
                </div>
                <input
                  type="range"
                  min={inp.min}
                  max={inp.max}
                  step={inp.step}
                  value={inp.val}
                  onChange={e => inp.set(Number(e.target.value))}
                  className="w-full accent-gold-600"
                />
              </div>
            ))}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-ink-600">{t.calculator.duration}</span>
                <span className="font-700 text-ink-900">{duration} yr</span>
              </div>
              <input type="range" min={1} max={6} step={1} value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full accent-gold-600" />
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-ink-100">
            <div className="flex justify-between items-center">
              <span className="font-700 text-ink-900">{t.calculator.totalCost}</span>
              <span className="font-display text-2xl font-700 text-gold-700">{fmt(totalCost)}</span>
            </div>
          </div>
        </div>

        {/* ROI */}
        <div className="card p-6">
          <h3 className="font-700 text-ink-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-brand-600" />{t.calculator.roi}</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-ink-50">
              <div className="text-xs text-ink-500 mb-0.5">{t.calculator.medianStart}</div>
              <div className="font-display text-lg font-700 text-ink-900">{fmt(course.startingSalary)}</div>
            </div>
            <div className="p-3 rounded-xl bg-ink-50">
              <div className="text-xs text-ink-500 mb-0.5">{t.calculator.fiveYrGrowth}</div>
              <div className="font-display text-lg font-700 text-ink-900">{fmt(course.growthSalary)}</div>
            </div>
            <div className="p-3 rounded-xl bg-brand-50 border border-brand-100">
              <div className="text-xs text-brand-600 mb-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{t.calculator.breakEven}</div>
              <div className="font-display text-lg font-700 text-brand-700">{breakEven.toFixed(1)} years</div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-brand-50 to-ocean-50 border border-brand-100">
              <div className="text-xs text-ink-500 mb-0.5">{t.calculator.roi}</div>
              <div className={`font-display text-2xl font-700 ${roi >= 0 ? 'text-brand-700' : 'text-coral-700'}`}>{roi.toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Loan EMI */}
      <div className="card p-6 mb-6">
        <h3 className="font-700 text-ink-900 mb-4 flex items-center gap-2"><IndianRupee className="w-4 h-4 text-ocean-600" />{t.calculator.loan}</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div>
            <div className="flex justify-between text-sm mb-1.5"><span className="text-ink-600">{t.calculator.loanAmount}</span><span className="font-700 text-ink-900">{fmt(loanAmount)}</span></div>
            <input type="range" min={100000} max={2000000} step={50000} value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} className="w-full accent-ocean-600" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1.5"><span className="text-ink-600">{t.calculator.interestRate}</span><span className="font-700 text-ink-900">{rate}%</span></div>
            <input type="range" min={8.5} max={12} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-ocean-600" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1.5"><span className="text-ink-600">{t.calculator.tenure}</span><span className="font-700 text-ink-900">{tenure} yr</span></div>
            <input type="range" min={1} max={15} step={1} value={tenure} onChange={e => setTenure(Number(e.target.value))} className="w-full accent-ocean-600" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1.5"><span className="text-ink-600">{t.calculator.moratorium}</span><span className="font-700 text-ink-900">{moratorium} yr</span></div>
            <input type="range" min={0} max={3} step={1} value={moratorium} onChange={e => setMoratorium(Number(e.target.value))} className="w-full accent-ocean-600" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-ocean-50 border border-ocean-100 text-center">
            <div className="text-xs text-ink-500 mb-0.5">{t.calculator.monthlyEmi}</div>
            <div className="font-display text-lg font-700 text-ocean-700">{fmt(emi)}</div>
          </div>
          <div className="p-3 rounded-xl bg-coral-50 border border-coral-100 text-center">
            <div className="text-xs text-ink-500 mb-0.5">{t.calculator.totalInterest}</div>
            <div className="font-display text-lg font-700 text-coral-700">{fmt(totalInterest)}</div>
          </div>
          <div className="p-3 rounded-xl bg-ink-50 text-center">
            <div className="text-xs text-ink-500 mb-0.5">{t.calculator.totalPayable}</div>
            <div className="font-display text-lg font-700 text-ink-900">{fmt(totalPayable)}</div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="card p-6">
        <h3 className="font-700 text-ink-900 mb-1 flex items-center gap-2"><Scale className="w-4 h-4 text-brand-600" />{t.calculator.compare}</h3>
        <p className="text-sm text-ink-500 mb-4">{t.calculator.compareDesc}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {courses.map(c => (
            <button
              key={c.id}
              onClick={() => addCompareCourse(c.id)}
              disabled={compareCourses.includes(c.id) || compareCourses.length >= 3}
              className="chip bg-ink-50 text-ink-600 border-ink-200 hover:border-brand-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-3 h-3" />
              {lang === 'hi' ? c.nameHi : c.name}
            </button>
          ))}
        </div>

        {compareData.length === 0 ? (
          <div className="text-center text-ink-400 text-sm py-8">{t.calculator.empty}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100">
                  <th className="text-left py-2 font-semibold text-ink-500"></th>
                  {compareData.map(c => (
                    <th key={c.id} className="text-left py-2 font-700 text-ink-900 px-2">
                      <div className="flex items-center gap-1.5">
                        <span>{c.emoji}</span>
                        <span className="text-xs">{lang === 'hi' ? c.nameHi : c.name}</span>
                        <button onClick={() => removeCompareCourse(c.id)} className="text-ink-300 hover:text-coral-600"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-ink-50">
                  <td className="py-2 text-ink-500">{t.calculator.cost}</td>
                  {compareData.map(c => <td key={c.id} className="py-2 font-semibold text-ink-900 px-2">{fmt(c.feesAnnual * 4)}</td>)}
                </tr>
                <tr className="border-b border-ink-50">
                  <td className="py-2 text-ink-500">{t.calculator.medianStart}</td>
                  {compareData.map(c => <td key={c.id} className="py-2 font-semibold text-ink-900 px-2">{fmt(c.startingSalary)}</td>)}
                </tr>
                <tr className="border-b border-ink-50">
                  <td className="py-2 text-ink-500">{t.calculator.breakEven}</td>
                  {compareData.map(c => <td key={c.id} className="py-2 font-semibold text-brand-700 px-2">{((c.feesAnnual * 4) / c.startingSalary).toFixed(1)} yr</td>)}
                </tr>
                <tr>
                  <td className="py-2 text-ink-500">{t.calculator.roiScore}</td>
                  {compareData.map(c => {
                    const r = ((c.growthSalary * 5 - c.feesAnnual * 4) / (c.feesAnnual * 4)) * 100;
                    return <td key={c.id} className={`py-2 font-700 px-2 ${r >= 0 ? 'text-brand-700' : 'text-coral-700'}`}>{r.toFixed(0)}%</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
