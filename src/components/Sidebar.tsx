import React from 'react';
import { NavLink } from 'react-router-dom';
import { Boxes, Server, Layout, Box, Orbit, Settings } from 'lucide-react';


function Sidebar() {

    const links = [
      { to: '/', icon: Layout, label: 'Dashboard', color: 'text-red-500', fontWeight: 'font-bold' },
      { to: '/pods', icon: Boxes, label: 'Pods', color: 'text-green-500', fontWeight: 'font-bold' },
      { to: '/nodes', icon: Server, label: 'Nodes', color: 'text-blue-500', fontWeight: 'font-bold' },
      { to: '/deployments', icon: Box, label: 'Deployments', color: 'text-purple-500', fontWeight: 'font-bold' },
      { to: '/ai', icon: Orbit, label: 'AI', color: 'text-yellow-500', fontWeight: 'font-bold' },
      { to: '/settings', icon: Settings, label: 'Settings', color: 'text-gray-500', fontWeight: 'font-bold' },
    ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">K8s Dashboard</h1>
      </div>
      <nav className="mt-6">
        {links.map((link) => (
        <NavLink
          key={link.to}
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
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;