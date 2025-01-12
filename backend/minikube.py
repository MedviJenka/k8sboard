import subprocess
from flask import Flask, jsonify
from flask_cors import CORS
from kubernetes import client, config

main_server_process = None
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
    global main_server_process
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
        if main_server_process is not None:
            main_server_process.terminate()
            main_server_process = None

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


if __name__ == '__main__':
    config.load_kube_config()
    app.run(host='0.0.0.0', port=5001, debug=True)
