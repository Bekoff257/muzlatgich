import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { AuthProvider, useAuth } from './app/auth';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AddRecordPage from './pages/AddRecordPage';
import ActivePage from './pages/ActivePage';
import DebtorsPage from './pages/DebtorsPage';
import ArchivePage from './pages/ArchivePage';
import { Layout } from './components/Layout';

const qc = new QueryClient();

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">Yuklanmoqda...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function App() {
  return <Routes>
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/*" element={<Protected><Layout><Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/add" element={<AddRecordPage />} />
      <Route path="/active" element={<ActivePage />} />
      <Route path="/debtors" element={<DebtorsPage />} />
      <Route path="/my-debts" element={<DebtorsPage mine />} />
      <Route path="/archive" element={<ArchivePage />} />
    </Routes></Layout></Protected>} />
  </Routes>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
