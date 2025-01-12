import express from 'express';
import cors from 'cors';
import * as k8s from '@kubernetes/client-node';

const app = express();
app.use(cors());
app.use(express.json());

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const appsApi = kc.makeApiClient(k8s.AppsV1Api);

app.get('/api/pods', async (req, res) => {
  try {
    const response = await k8sApi.listPodForAllNamespaces();
    res.json(response.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/nodes', async (req, res) => {
  try {
    const response = await k8sApi.listNode();
    res.json(response.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/deployments', async (req, res) => {
  try {
    const response = await appsApi.listDeploymentForAllNamespaces();
    res.json(response.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});