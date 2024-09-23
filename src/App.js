import './App.css'; // CSS dosyanız
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './FlightsPage.css';
import FlightsPage from './FlightsPage';
import HomePage from './HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flights" element={<FlightsPage />} />
      </Routes>
    </Router>
  );
}

export default App;