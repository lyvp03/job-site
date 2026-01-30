import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CommonLayout from './components/layout/CommonLayout';
import JobDetailPage from './pages/Candidate/JobDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Option 1: Route with MainLayout directly */}
        <Route path="/" element={<CommonLayout />}>
          <Route index element={<JobDetailPage />} />
          {/* Có thể thêm routes khác sau */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;