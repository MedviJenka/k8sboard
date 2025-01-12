import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Boxes, Server, Layout, Box, Orbit, Wrench, Play, CheckCircle } from 'lucide-react';
import axios from 'axios';

const links = [
  { to: '/', icon: Layout, label: 'Dashboard', color: 'text-red-500', fontWeight: 'font-bold' },
  { to: '/pods', icon: Boxes, label: 'Pods', color: 'text-green-500', fontWeight: 'font-bold' },
  { to: '/nodes', icon: Server, label: 'Nodes', color: 'text-blue-500', fontWeight: 'font-bold' },
  { to: '/deployments', icon: Box, label: 'Deployments', color: 'text-purple-500', fontWeight: 'font-bold' },
  { to: '/ai', icon: Orbit, label: 'AI', color: 'text-yellow-500', fontWeight: 'font-bold' },
  { to: '/settings', icon: Wrench, label: 'Settings', color: 'text-gray-500', fontWeight: 'font-bold' },
  { to: '#', icon: Play, label: 'Start Minikube', color: 'text-green-500', fontWeight: 'font-bold', action: true },
];

function Sidebar() {
  const [status, setStatus] = useState<JSX.Element | null>(null);
  const [loading, setLoading] = useState(false);
  const [minikubeStarted, setMinikubeStarted] = useState(false);

  const handleStartMinikube = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const response = await axios.post('http://localhost:5000/api/admin/minikube/run');
      setMinikubeStarted(true);
      setStatus(
        <span className="flex items-center">
          {response.data.message || 'Minikube started successfully'}
          <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
        </span>
      );
    } catch (error) {
      setStatus(
        <span className="text-red-500">
          {error.response?.data?.error || 'Failed to start Minikube'}
        </span>
      );
      setMinikubeStarted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">K8s Dashboard</h1>
      </div>
      <nav className="mt-6">
        {links.map((link) => (
          <div key={link.to}>
            {link.action ? (
              <button
                className={`flex items-center w-full px-6 py-3 text-gray-600 hover:bg-gray-100 ${
                  loading ? 'bg-gray-100' : ''
                }`}
                onClick={handleStartMinikube}
                disabled={loading || minikubeStarted}
              >
                <link.icon className={`w-5 h-5 mr-3 ${link.color}`} />
                <span className={link.fontWeight}>
                  {loading
                    ? 'Starting...'
                    : minikubeStarted
                    ? 'Minikube Started'
                    : link.label}
                </span>
              </button>
            ) : (
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 ${
                    isActive ? 'bg-gray-100 text-blue-600' : ''
                  }`
                }
              >
                <link.icon className={`w-5 h-5 mr-3 ${link.color}`} />
                <span className={link.fontWeight}>{link.label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
      {status && <div className="p-4 mt-4 text-sm text-gray-700">{status}</div>}
    </div>
  );
}

export default Sidebar;
