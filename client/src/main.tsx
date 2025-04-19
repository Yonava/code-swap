import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import HomeView from './views/HomeView';
import { StrictMode } from 'react';
import ChallengeRoot from './views/ChallengeRoot';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import './index.css';

const app = document.getElementById('root')!;
const queryClient = new QueryClient()

ReactDOM.createRoot(app).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
