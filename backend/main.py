import subprocess
from flask import Flask, jsonify, request
from flask_cors import CORS
from kubernetes import client, config


app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/*": {"origins": "*"}})


try:
    config.load_kube_config()
except config.config_exception.ConfigException:
    config.load_incluster_config()

# Initialize Kubernetes clients
core_v1 = client.CoreV1Api()
apps_v1 = client.AppsV1Api()


def start_minikube():
    """Starts Minikube and reloads the Kubernetes configuration."""
    try:
        # Check if Minikube is already running
        status_process = subprocess.run(
            ['minikube', 'status'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        if 'host: Running' in status_process.stdout and 'kubelet: Running' in status_process.stdout:
            return {"message": "Minikube is already running", "status": "running"}

        # Start Minikube
        start_process = subprocess.run(
            ['minikube', 'start', '--wait=all'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )

        # Reload Kubernetes configuration
        config.load_kube_config()

        return {
            "message": "Minikube started successfully",
            "output": start_process.stdout,
            "status": "started"
        }

    except subprocess.CalledProcessError as e:
        return {"message": "Failed to start Minikube", "details": e.stderr, "status": "error"}
    except Exception as e:
        return {"message": str(e), "status": "error"}


@app.route('/api/admin/minikube/run', methods=['POST'])
def run_minikube():
    """API endpoint to start Minikube."""
    result = start_minikube()
    return jsonify(result)


@app.route('/api/health')
def health_check() -> dict:
    return {'service': 'healthy'}


@app.route('/api/logs', methods=['GET'])
def get_logs():
    """
    Retrieves logs for a specified pod in a namespace.
    Query Parameters:
    - namespace: The namespace of the pod (default: "default").
    - pod_name: The name of the pod.
    """
    namespace = request.args.get('namespace', 'default')  # Default namespace is "default"
    pod_name = request.args.get('pod_name')  # Pod name must be provided

    if not pod_name:
        return jsonify({"error": "pod_name query parameter is required"}), 400

    try:
        # Retrieve logs for the specified pod
        logs = core_v1.read_namespaced_pod_log(
            name=pod_name,
            namespace=namespace,
            pretty=True
        )
        return jsonify({"logs": logs.splitlines()})
    except client.exceptions.ApiException as e:
        return jsonify({"error": str(e)}), 500


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
                    "metadata": {"name": node.metadata.name},
                    "status": {
                        "conditions": [
                            {"type": c.type, "status": c.status}
                            for c in node.status.conditions
                        ],
                        "capacity": {
                            "cpu": node.status.capacity.get("cpu", "N/A"),
                            "memory": node.status.capacity.get("memory", "N/A"),
                        },
                        "phase": node.status.phase if hasattr(node.status, "phase") else "Unknown",
                    },
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
