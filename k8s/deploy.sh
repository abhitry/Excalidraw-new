#!/bin/bash

echo "🚀 Deploying Excelidraw App to Kubernetes..."

# Apply namespace first
echo "📦 Creating namespace..."
kubectl apply -f k8s/namespace.yaml

# Apply secrets and configmaps
echo "🔐 Creating secrets and configmaps..."
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml

# Apply PVC
echo "💾 Creating persistent volume claims..."
kubectl apply -f k8s/postgres-pvc.yaml

# Apply database
echo "🗄️ Deploying PostgreSQL..."
kubectl apply -f k8s/postgres-deployment.yaml

# Wait for postgres to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/excelidraw-postgres -n excelidraw

# Apply backend services
echo "🔧 Deploying backend services..."
kubectl apply -f k8s/http-backend-deployment.yaml
kubectl apply -f k8s/ws-backend-deployment.yaml

# Apply frontend
echo "🎨 Deploying frontend..."
kubectl apply -f k8s/frontend-deployment.yaml

# Apply ingress
echo "🌐 Setting up ingress..."
kubectl apply -f k8s/ingress.yaml

echo "✅ Deployment complete!"