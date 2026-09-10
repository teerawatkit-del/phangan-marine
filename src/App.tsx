import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { BookingProvider } from './context/BookingContext';
import { TourProvider } from './context/TourContext';
import { BusinessProvider } from './context/BusinessContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { StickyMobileBar } from './components/layout/StickyMobileBar';
import { FloatingContactWidget } from './components/layout/FloatingContactWidget';

import { HomePage } from './pages/HomePage';
import { ToursPage } from './pages/ToursPage';
import { TourDetailPage } from './pages/TourDetailPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { BookingPage } from './pages/BookingPage';
import { AdminPage } from './pages/AdminPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BusinessProvider>
        <TourProvider>
          <BookingProvider>
            <Router>
              <ScrollToTop />
              <div className="flex flex-col min-h-screen bg-brand-bg text-brand-text selection:bg-brand-accent selection:text-brand-primary font-sans antialiased">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tours" element={<ToursPage />} />
                    <Route path="/tours/:slug" element={<TourDetailPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/book" element={<BookingPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </main>
                <Footer />
                <StickyMobileBar />
                <FloatingContactWidget />
              </div>
            </Router>
          </BookingProvider>
        </TourProvider>
      </BusinessProvider>
    </LanguageProvider>
  );
};

export default App;
