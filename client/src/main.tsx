import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import HomeView from './views/HomeView';
import { StrictMode } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import './index.css';
import ChallengeView from './views/ChallengeView';
import { MatchContextProvider } from './state/match/MatchContext';

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
            element={
              // <MatchContextProvider>
              <ChallengeView />
              // </MatchContextProvider>
            }
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
