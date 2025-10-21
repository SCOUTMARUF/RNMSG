


import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import JoinPage from './pages/JoinPage';
import GalleryPage from './pages/GalleryPage';
import AwardsPage from './pages/AwardsPage';
import BlogPage from './pages/BlogPage';
import EventPage from './pages/EventPage';
import EventFramesPage from './pages/EventFramesPage';
import BookPage from './pages/BookPage';
import BookDetailPage from './pages/BookDetailPage';
import LoginModal from './components/LoginModal';
import Toast from './components/Toast';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import AboutPage from './pages/AboutPage';
import FoundersPage from './pages/FoundersPage';
import HistoryPage from './pages/HistoryPage';
import ScrollToTop from './components/ScrollToTop';
import PatrolPage from './pages/PatrolPage';


const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/committee" element={<AboutPage />} />
            <Route path="/founders" element={<FoundersPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/Achievements" element={<AwardsPage />} />
            <Route path="/patrols" element={<PatrolPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/join" element={<JoinPage />} />
            <Route path="/frames" element={<EventFramesPage />} />
            <Route path="/books" element={<BookPage />} />
            <Route path="/books/:bookId" element={<BookDetailPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
        <LoginModal />
        <Toast />
      </div>
    </HashRouter>
  );
};

export default App;