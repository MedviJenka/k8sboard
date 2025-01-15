import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Boxes, Server, Box, Blocks } from 'lucide-react';
import type { Pod, Node, Deployment } from '../types/kubernetes';


function AIService() {

    const { data: nodes, isLoading } = useQuery<Node[]>('ai-service', async () => {
    const response = await axios.get('http://localhost:5000/api/ai_service');
    return response.data.items;});

    return (
        <div>
            hello
        </div>
    )
}
export default AIService;

