import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import type { Node } from '../types/kubernetes';

function Nodes() {
  const { data: nodes, isLoading } = useQuery<Node[]>('nodes', async () => {
    const response = await axios.get('http://localhost:3001/api/nodes');
    return response.data.items;
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nodes</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Memory
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {nodes?.map((node) => (
              <tr key={node.metadata.name}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {node.metadata.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    node.status.conditions.some(c => c.type === 'Ready' && c.status === 'True')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {node.status.conditions.some(c => c.type === 'Ready' && c.status === 'True')
                      ? 'Ready'
                      : 'Not Ready'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {node.status.capacity.cpu}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {node.status.capacity.memory}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Nodes;