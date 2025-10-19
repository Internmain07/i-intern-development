import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { FAQPage } from './pages/FAQPage';

const FAQ: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<FAQPage />} />
    </Routes>
  );
};

export default FAQ;
