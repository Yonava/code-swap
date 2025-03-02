import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import ChallengeView from './views/ChallengeView';
import HomeView from './views/HomeView';
import { StrictMode } from 'react';
import './index.css';

const app = document.getElementById('root')!;

ReactDOM.createRoot(app).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomeView />}
        />
        <Route
          path="/challenge"
          element={<ChallengeView />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
