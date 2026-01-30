import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import MainLayout from './components/layout/MainLayout';
import JobList from './pages/Candidate/JobList';


function App() {
  return (
    <Router>
      <Routes>
      <MainLayout>
        <JobList></JobList>
      </MainLayout>
      </Routes>
    </Router>
  );
}

export default App;