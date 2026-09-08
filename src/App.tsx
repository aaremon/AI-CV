import React, { useState, useEffect } from 'react';
import Navbar, { NavTabType } from './components/Navbar';
import TopHeader from './components/TopHeader';
import AuthModal from './components/AuthModal';
import PrivacySettingsModal from './components/PrivacySettingsModal';
import CvBuilderTab from './components/CvBuilderTab';
import AnalyzerTab from './components/AnalyzerTab';
import CoverLetterTab from './components/CoverLetterTab';
import LinkedInOptimizerTab from './components/LinkedInOptimizerTab';
import BioGeneratorTab from './components/BioGeneratorTab';
import OutreachEmailsTab from './components/OutreachEmailsTab';
import FeedbackTab from './components/FeedbackTab';
import AboutTab from './components/AboutTab';
import PresentationSlides from './components/PresentationSlides';
import LandingPage from './components/LandingPage';
import UserDashboard from './components/user/UserDashboard';
import MyCVsTab from './components/user/MyCVsTab';
import GeneratedDocsTab from './components/user/GeneratedDocsTab';
import SecuritySettingsTab from './components/user/SecuritySettingsTab';
import AdminDashboardOverview from './components/admin/AdminDashboardOverview';
import { FeedbackDbRecord, UserDbRecord } from './types';

export default function App() {
  // Navigation & session state
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    const isStarted = localStorage.getItem('cv_engine_started') === 'true' || sessionStorage.getItem('cv_engine_started') === 'true';
    const hasUser = !!localStorage.getItem('resume_auth_user');
    return !isStarted && !hasUser;
  });
  const [activeTab, setActiveTab] = useState<NavTabType>('dashboard');
  const [currentTime, setCurrentTime] = useState<string>('2026-06-09 05:05:00');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Initialize and load dark mode state from persistence
  useEffect(() => {
    const stored = localStorage.getItem('resume_dark_mode');
    const isDark = stored === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('resume_dark_mode', String(next));
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };
  
  // Auth state
  const [loggedInUser, setLoggedInUser] = useState<any | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPrivacySettingsOpen, setIsPrivacySettingsOpen] = useState(false);

  // Administrative stats
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminRecords, setAdminRecords] = useState<UserDbRecord[]>([]);
  const [loadingAdminRecords, setLoadingAdminRecords] = useState(false);

  // Feedback registry
  const [allFeedback, setAllFeedback] = useState<FeedbackDbRecord[]>([]);

  // Update time dynamic ticks
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const formatStr = now.toISOString().replace('T', ' ').substring(0, 19);
      setCurrentTime(formatStr);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch feedback elements and active session details
  useEffect(() => {
    fetchFeedbackHistory();
    
    // Check local storage for active session
    const storedUser = localStorage.getItem('resume_auth_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setLoggedInUser(parsed);
        if (parsed?.email) localStorage.setItem('cv_user_email', parsed.email);
      } catch (e) {
        localStorage.removeItem('resume_auth_user');
      }
    }
  }, []);

  const fetchFeedbackHistory = async () => {
    try {
      const res = await fetch('/api/feedback');
      if (res.ok) {
        const data = await res.json();
        setAllFeedback(data);
      }
    } catch (err) {
      console.error("Error drawing feedback record logs: ", err);
    }
  };

  const handleFetchAdminRecords = async () => {
    setLoadingAdminRecords(true);
    try {
      const res = await fetch('/api/admin/records');
      if (res.ok) {
        const data = await res.json();
        setAdminRecords(data);
      }
    } catch (err) {
      console.error("Error retrieving admin details:", err);
    } finally {
      setLoadingAdminRecords(false);
    }
  };

  const handleDeleteAdminRecord = async (id: number) => {
    try {
      const res = await fetch(`/api/records/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        handleFetchAdminRecords();
      } else {
        const data = await res.json();
        alert(data.error || "Unable to delete record from logging database");
      }
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('resume_auth_user');
    localStorage.removeItem('cv_engine_started');
    sessionStorage.removeItem('cv_engine_started');
    setShowLanding(true);
  };

  const handleAuthSuccess = (userObj: any) => {
    setLoggedInUser(userObj);
    localStorage.setItem('resume_auth_user', JSON.stringify(userObj));
    localStorage.setItem('cv_engine_started', 'true');
    sessionStorage.setItem('cv_engine_started', 'true');
    if (userObj.role === 'admin') {
      setIsAdminLoggedIn(true);
      setActiveTab('admin');
    }
    setIsAuthOpen(false);
    setShowLanding(false);
  };

  const handleAdminAuthSuccess = (adminObj?: any) => {
    const adminUser = adminObj || {
      id: 999,
      email: 'thapakaji@gmail.com',
      name: 'Platform Administrator',
      role: 'admin'
    };
    setLoggedInUser(adminUser);
    localStorage.setItem('resume_auth_user', JSON.stringify(adminUser));
    localStorage.setItem('cv_engine_started', 'true');
    sessionStorage.setItem('cv_engine_started', 'true');
    setIsAdminLoggedIn(true);
    setActiveTab('admin');
    setIsAuthOpen(false);
    setShowLanding(false);
  };

  const handleGetStarted = () => {
    localStorage.setItem('cv_engine_started', 'true');
    sessionStorage.setItem('cv_engine_started', 'true');
    setShowLanding(false);
  };

  if (showLanding) {
    return (
      <>
        <LandingPage
          onGetStarted={handleGetStarted}
          onOpenAuth={() => setIsAuthOpen(true)}
          loggedInUser={loggedInUser}
        />
        {isAuthOpen && (
          <AuthModal
            onClose={() => setIsAuthOpen(false)}
            onAuthSuccess={handleAuthSuccess}
            onAdminAuthSuccess={handleAdminAuthSuccess}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-[#F8FAFC] dark:bg-[#0c111e] overflow-hidden transition-colors duration-200" id="app-container">
      {/* Sidebar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTime={currentTime}
        feedbackLength={allFeedback.length}
        isAdminLoggedIn={isAdminLoggedIn}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenAuth={() => setIsAuthOpen(true)}
        onGoHome={() => {
          sessionStorage.removeItem('cv_engine_started');
          setShowLanding(true);
        }}
        onOpenPrivacySettings={() => setIsPrivacySettingsOpen(true)}
      />

      {/* Main Content Area with Top Header */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header bar with professional right-corner Admin Panel button */}
        <TopHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdminLoggedIn={isAdminLoggedIn}
          loggedInUser={loggedInUser}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenPrivacySettings={() => setIsPrivacySettingsOpen(true)}
        />

        {/* Main content body with responsive scroll boundary and optimized padding */}
        <main className="flex-1 overflow-y-auto px-3 py-5 sm:p-6 md:p-8 bg-[#F8FAFC] dark:bg-[#0b0f19] transition-colors duration-200" id="content-body">
          {activeTab === 'dashboard' && (
            <UserDashboard
              loggedInUser={loggedInUser}
              currentTime={currentTime}
              onNavigate={(tab) => setActiveTab(tab as NavTabType)}
              onOpenPrivacySettings={() => setIsPrivacySettingsOpen(true)}
            />
          )}

          {activeTab === 'my_cvs' && (
            <MyCVsTab
              loggedInUser={loggedInUser}
              onNavigate={(tab) => setActiveTab(tab as NavTabType)}
            />
          )}

          {activeTab === 'generated_docs' && (
            <GeneratedDocsTab
              loggedInUser={loggedInUser}
              onNavigate={(tab) => setActiveTab(tab as NavTabType)}
            />
          )}

          {activeTab === 'privacy_security' && (
            <SecuritySettingsTab
              loggedInUser={loggedInUser}
              onLogout={handleLogout}
              onProfileUpdated={(updated) => {
                setLoggedInUser(updated);
                localStorage.setItem('resume_auth_user', JSON.stringify(updated));
              }}
            />
          )}

          {activeTab === 'builder' && (
            <CvBuilderTab />
          )}

          {activeTab === 'ats' && (
            <AnalyzerTab
              loggedInUser={loggedInUser}
              currentTime={currentTime}
            />
          )}

          {activeTab === 'cover_letter' && (
            <CoverLetterTab loggedInUser={loggedInUser} />
          )}

          {activeTab === 'linkedin' && (
            <LinkedInOptimizerTab loggedInUser={loggedInUser} />
          )}

          {activeTab === 'bio' && (
            <BioGeneratorTab />
          )}

          {activeTab === 'emails' && (
            <OutreachEmailsTab />
          )}

          {activeTab === 'slides' && (
            <PresentationSlides />
          )}

          {activeTab === 'feedback' && (
            <FeedbackTab allFeedback={allFeedback} onFeedbackSumitted={fetchFeedbackHistory} />
          )}

          {activeTab === 'about' && (
            <AboutTab />
          )}

          {activeTab === 'admin' && (
            <AdminDashboardOverview
              adminUsername={adminUsername}
              setAdminUsername={setAdminUsername}
              adminPassword={adminPassword}
              setAdminPassword={setAdminPassword}
              isAdminLoggedIn={isAdminLoggedIn}
              setIsAdminLoggedIn={setIsAdminLoggedIn}
              adminError={adminError}
              setAdminError={setAdminError}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Auth Login/Signup Modal */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          onAdminAuthSuccess={handleAdminAuthSuccess}
        />
      )}

      {/* Privacy & AI Data Controls Modal */}
      <PrivacySettingsModal
        isOpen={isPrivacySettingsOpen}
        onClose={() => setIsPrivacySettingsOpen(false)}
        currentUserEmail={loggedInUser?.email || ''}
      />
    </div>
  );
}
