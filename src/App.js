import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';

// Временные компоненты для остальных страниц
const Prices = () => <div>Страница с ценами</div>;
const Investors = () => <div>Страница для инвесторов</div>;
const Presentation = () => <div>Страница с презентацией</div>;
const Consultation = () => <div>Страница консультации</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/presentation" element={<Presentation />} />
        <Route path="/consultation" element={<Consultation />} />
      </Routes>
    </Router>
  );
}

export default App;