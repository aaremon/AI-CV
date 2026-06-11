import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import AnalyzerTab from './components/AnalyzerTab';
import FeedbackTab from './components/FeedbackTab';
import AboutTab from './components/AboutTab';
import AdminTab from './components/AdminTab';
import LandingPage from './components/LandingPage';
import { FeedbackDbRecord, UserDbRecord } from './types';

export default function App() {
  // Navigation & session state
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    return sessionStorage.getItem('cv_engine_started') !== 'true';
  });
  const [activeTab, setActiveTab ] = useState<'analyzer' | 'feedback' | 'about' | 'admin'>('analyzer');
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

  // Fetch feedback elements
  useEffect(() => {
    fetchFeedbackHistory();
    
    // Check if user was previously logged in
    const storedUser = localStorage.getItem('resume_auth_user');
    if (storedUser) {
      try {
        setLoggedInUser(JSON.parse(storedUser));
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
    sessionStorage.removeItem('cv_engine_started');
    setShowLanding(true);
  };

  const handleAuthSuccess = (userObj: any) => {
    setLoggedInUser(userObj);
    localStorage.setItem('resume_auth_user', JSON.stringify(userObj));
    setIsAuthOpen(false);
  };

  const handleGetStarted = () => {
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
          />
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F8FAFC] dark:bg-[#0c111e] overflow-hidden transition-colors duration-200" id="app-container">
      {/* Top Navbar */}
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
      />

      {/* Main content body with responsive scroll boundary and optimized padding for mobile */}
      <main className="flex-1 overflow-y-auto px-3 py-5 sm:p-6 md:p-8 bg-[#F8FAFC] dark:bg-[#0b0f19] transition-colors duration-200" id="content-body">
        {activeTab === 'analyzer' && (
          <AnalyzerTab loggedInUser={loggedInUser} currentTime={currentTime} />
        )}

        {activeTab === 'feedback' && (
          <FeedbackTab allFeedback={allFeedback} onFeedbackSumitted={fetchFeedbackHistory} />
        )}

        {activeTab === 'about' && (
          <AboutTab />
        )}

        {activeTab === 'admin' && (
          <AdminTab
            adminUsername={adminUsername}
            setAdminUsername={setAdminUsername}
            adminPassword={adminPassword}
            setAdminPassword={setAdminPassword}
            isAdminLoggedIn={isAdminLoggedIn}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            adminError={adminError}
            setAdminError={setAdminError}
            adminRecords={adminRecords}
            loadingAdminRecords={loadingAdminRecords}
            onRefreshRecords={handleFetchAdminRecords}
            onDeleteRecord={handleDeleteAdminRecord}
            allFeedback={allFeedback}
          />
        )}
      </main>

      {/* Auth Login/Signup Modal */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
