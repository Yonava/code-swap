import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import HomeView from './views/HomeView';
import { StrictMode } from 'react';
import ChallengeRoot from './views/ChallengeRoot';
import './index.css';

const app = document.getElementById('root')!;

ReactDOM.createRoot(app).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={<HomeView />}
        />
        <Route
          path="challenge"
          element={<ChallengeRoot />}
        />
        <Route
          path="*"
          element={<div>404</div>}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
