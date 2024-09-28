import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import TopNav from './components/TopNav';
import BottomNav from './components/BottomNav';
import LanguageSelection from './components/LanguageSelection';
import Home from './pages/Home';
import Search from './pages/Search';
import SearchResults from './components/SearchResults';
import Discovery from './pages/Discovery';
import Settings from './pages/Settings';
import { NewsProvider } from './context/NewsContext';
import AboutPage from './pages/About';
import NewsDetailPage from './components/NewsDetailPage';

const App = () => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || '');

  useEffect(() => {
    if (!language) {
      setLanguage('');
    }
  }, [language]);

  if (!language) {
    return <LanguageSelection onSelect={setLanguage} />;
  }

  return (
    <NewsProvider>
      <Router>
        <TopNav />
        <Routes>
          <Route path="/" element={<Home language={language} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/ainews" element={<NewsDetailPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <BottomNav />
      </Router>
    </NewsProvider>
  );
};

export default App;
