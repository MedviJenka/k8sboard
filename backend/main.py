from flask import Flask, jsonify
from flask_cors import CORS
from kubernetes import client, config


app = Flask(__name__)

# Configure CORS
CORS(app)

# Load Kubernetes configuration
try:
    config.load_kube_config()
except config.config_exception.ConfigException:
    config.load_incluster_config()

# Initialize Kubernetes clients
core_v1 = client.CoreV1Api()
apps_v1 = client.AppsV1Api()


@app.route('/api/pods', methods=['GET'])
def list_pods() -> jsonify:
    try:
        pods = core_v1.list_pod_for_all_namespaces()
        result = {
            "items": [
                {
                    "metadata": {
                        "name": pod.metadata.name,
                        "namespace": pod.metadata.namespace,
                        "uid": pod.metadata.uid
                    },
                    "status": {
                        "phase": pod.status.phase,
                        "conditions": [
                            {"type": c.type, "status": c.status}
                            for c in (pod.status.conditions or [])
                        ]
                    }
                }
                for pod in pods.items
            ]
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({"items": [], "error": str(e)})


@app.route('/api/nodes', methods=['GET'])
def list_nodes():
    try:
        nodes = core_v1.list_node()
        result = {
            "items": [
                {
                    "metadata": {
                        "name": node.metadata.name
                    },
                    "status": {
                        "conditions": [
                            {"type": c.type, "status": c.status}
                            for c in node.status.conditions
                        ],
                        "capacity": {
                            "cpu": node.status.capacity.get("cpu", "N/A"),
                            "memory": node.status.capacity.get("memory", "N/A")
                        }
                    }
                }
                for node in nodes.items
            ]
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({"items": [], "error": str(e)})


@app.route('/api/deployments', methods=['GET'])
def list_deployments():
    try:
        deployments = apps_v1.list_deployment_for_all_namespaces()
        result = {
            "items": [
                {
                    "metadata": {
                        "name": dep.metadata.name,
                        "namespace": dep.metadata.namespace
                    },
                    "spec": {
                        "replicas": dep.spec.replicas
                    },
                    "status": {
                        "availableReplicas": dep.status.available_replicas or 0,
                        "readyReplicas": dep.status.ready_replicas or 0
                    }
                }
                for dep in deployments.items
            ]
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({"items": [], "error": str(e)})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
