import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Language, ViewId, SavedItem, QuizResult } from '@/types';
import { getDict, type Dict } from '@/i18n/dict';

interface AppContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: Dict;
  view: ViewId;
  setView: (v: ViewId) => void;
  parentMode: boolean;
  setParentMode: (v: boolean) => void;
  saved: SavedItem[];
  toggleSave: (item: SavedItem) => void;
  isSaved: (id: string) => boolean;
  clearSaved: () => void;
  quizResults: QuizResult[];
  addQuizResult: (r: QuizResult) => void;
  compareCourses: string[];
  addCompareCourse: (id: string) => void;
  removeCompareCourse: (id: string) => void;
  selectedCareerId: string;
  setSelectedCareerId: (id: string) => void;
  calculatorCourseId: string;
  setCalculatorCourseId: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function usePersistentState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  const update = useCallback(
    (v: T) => {
      setState(v);
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch {
        /* ignore */
      }
    },
    [key],
  );
  return [state, update];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = usePersistentState<Language>('ns_lang', 'en');
  const [view, setView] = useState<ViewId>('home');
  const [parentMode, setParentMode] = usePersistentState<boolean>('ns_parent', false);
  const [saved, setSaved] = usePersistentState<SavedItem[]>('ns_saved', []);
  const [quizResults, setQuizResults] = usePersistentState<QuizResult[]>('ns_quiz', []);
  const [compareCourses, setCompareCourses] = usePersistentState<string[]>('ns_compare', []);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('software-engineer');
  const [calculatorCourseId, setCalculatorCourseId] = useState<string>('btech-cse');

  const setLang = useCallback(
    (l: Language) => {
      setLangState(l);
      document.documentElement.lang = l;
    },
    [setLangState],
  );

  const t = getDict(lang);

  const toggleSave = useCallback(
    (item: SavedItem) => {
      setSaved(prev => {
        const exists = prev.some(s => s.id === item.id);
        return exists ? prev.filter(s => s.id !== item.id) : [...prev, item];
      });
    },
    [setSaved],
  );

  const isSaved = useCallback((id: string) => saved.some(s => s.id === id), [saved]);

  const clearSaved = useCallback(() => setSaved([]), [setSaved]);

  const addQuizResult = useCallback(
    (r: QuizResult) => {
      setQuizResults(prev => [r, ...prev].slice(0, 10));
    },
    [setQuizResults],
  );

  const addCompareCourse = useCallback(
    (id: string) => {
      setCompareCourses(prev => (prev.includes(id) ? prev : [...prev, id].slice(0, 3)));
    },
    [setCompareCourses],
  );

  const removeCompareCourse = useCallback(
    (id: string) => {
      setCompareCourses(prev => prev.filter(c => c !== id));
    },
    [setCompareCourses],
  );

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        view,
        setView,
        parentMode,
        setParentMode,
        saved,
        toggleSave,
        isSaved,
        clearSaved,
        quizResults,
        addQuizResult,
        compareCourses,
        addCompareCourse,
        removeCompareCourse,
        selectedCareerId,
        setSelectedCareerId,
        calculatorCourseId,
        setCalculatorCourseId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
