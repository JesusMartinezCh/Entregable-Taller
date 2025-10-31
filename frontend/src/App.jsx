import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClienteTramite from './components/ClienteTramite';
import TramiteForm from './components/TramiteForm';
import TramiteList from './components/TramiteList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClienteTramite />} />
        <Route path="/admin" element={
          <div>
            <TramiteForm />
            <TramiteList />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
