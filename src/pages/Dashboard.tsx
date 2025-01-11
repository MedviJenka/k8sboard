import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Activity, Server, Box } from 'lucide-react';
import type { Pod, Node, Deployment } from '../types/kubernetes';


function Dashboard() {
  const { data: pods, error: podsError } = useQuery<Pod[]>(
    'pods',
    async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/pods');
        return response.data.items;
      } catch (error) {
        // Return empty array instead of throwing
        return [];
      }
    },
    { retry: false }
  );

  const { data: nodes, error: nodesError } = useQuery<Node[]>(
    'nodes',
    async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/nodes');
        return response.data.items;
      } catch (error) {
        // Return empty array instead of throwing
        return [];
      }
    },
    { retry: false }
  );

  const { data: deployments, error: deploymentsError } = useQuery<Deployment[]>(
    'deployments',
    async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/deployments');
        return response.data.items;
      } catch (error) {
        // Return empty array instead of throwing
        return [];
      }
    },
    { retry: false }
  );

  const hasError = podsError || nodesError || deploymentsError;

  if (hasError) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">
          Unable to connect to the Kubernetes API server. Please make sure the backend server is running.
        </p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Running Pods',
      value: pods?.filter(pod => pod.status.phase === 'Running').length || 0,
      icon: Activity,
      color: 'text-green-600',
    },
    {
      title: 'Active Nodes',
      value: nodes?.length || 0,
      icon: Server,
      color: 'text-blue-600',
    },
    {
      title: 'Deployments',
      value: deployments?.length || 0,
      icon: Box,
      color: 'text-purple-600',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cluster Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-3xl font-semibold mt-2">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
          {/* Add events list here */}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Resource Usage</h2>
          {/* Add resource usage charts here */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;