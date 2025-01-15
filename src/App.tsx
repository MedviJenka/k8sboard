import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Pods from './pages/Pods';
import Nodes from './pages/Nodes';
import Deployments from './pages/Deployments';
import AIService from './pages/AIService';

const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pods" element={<Pods />} />
              <Route path="/nodes" element={<Nodes />} />
              <Route path="/deployments" element={<Deployments />}/>
              <Route path="/ai" element={<AIService />}/>
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

