import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import PartnerSimulator from './components/PartnerSimulator';
import CallbackPage from './components/CallbackPage';

function App() {
  return (
    <Routes>
      <Route path="/"  element={<PartnerSimulator />} />
      <Route path="/callback"  element={<CallbackPage />} />
    </Routes>
  );
}

export default App;