import subprocess
from kubernetes import config


def start_minikube() -> dict:

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
            return {"message": "Minikube is running", "status": "running"}

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
