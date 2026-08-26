import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Home } from '@/components/Home';
import { StreamSelector } from '@/components/StreamSelector';
import { CourseExplorer } from '@/components/CourseExplorer';
import { PassionToPaisa } from '@/components/PassionToPaisa';
import { CostCalculator } from '@/components/CostCalculator';
import { ScholarshipFinder } from '@/components/ScholarshipFinder';
import { CareerSimulator } from '@/components/CareerSimulator';
import { MentorReviews } from '@/components/MentorReviews';
import { ParentMode } from '@/components/ParentMode';
import { StudentProfile } from '@/components/StudentProfile';

function AppContent() {
  const { view } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-ink-50">
      <Navbar />
      <main className="flex-1">
        {view === 'home' && <Home />}
        {view === 'stream' && <StreamSelector />}
        {view === 'courses' && <CourseExplorer />}
        {view === 'passion' && <PassionToPaisa />}
        {view === 'calculator' && <CostCalculator />}
        {view === 'scholarships' && <ScholarshipFinder />}
        {view === 'careers' && <CareerSimulator />}
        {view === 'mentors' && <MentorReviews />}
        {view === 'parent' && <ParentMode />}
        {view === 'profile' && <StudentProfile />}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
