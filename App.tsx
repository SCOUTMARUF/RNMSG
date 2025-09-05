
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import JoinPage from './pages/JoinPage';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import EventPage from './pages/EventPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/join" element={<JoinPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;