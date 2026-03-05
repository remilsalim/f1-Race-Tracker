import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CalendarPage from './pages/CalendarPage';
import HistoryPage from './pages/HistoryPage';
import RaceDetails from './pages/RaceDetails';
import EventsPage from './pages/EventsPage';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/race/:year/:round" element={<RaceDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
