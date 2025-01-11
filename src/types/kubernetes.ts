export interface Pod {
  metadata: {
    name: string;
    namespace: string;
    uid: string;
  };
  status: {
    phase: string;
    conditions: Array<{
      type: string;
      status: string;
    }>;
  };
}

export interface Node {
  metadata: {
    name: string;
  };
  status: {
    conditions: Array<{
      type: string;
      status: string;
    }>;
    capacity: {
      cpu: string;
      memory: string;
    };
  };
}

export interface Deployment {
  metadata: {
    name: string;
    namespace: string;
  };
  spec: {
    replicas: number;
  };
  status: {
    availableReplicas: number;
    readyReplicas: number;
  };
}