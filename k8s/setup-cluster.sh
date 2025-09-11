#!/bin/bash

echo "🚀 Setting up nginx-ingress and cert-manager for new cluster..."

# Install nginx-ingress controller
echo "📦 Installing nginx-ingress controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# Wait for nginx-ingress to be ready
echo "⏳ Waiting for nginx-ingress controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=300s

# Install cert-manager
echo "🔐 Installing cert-manager..."
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.2/cert-manager.yaml

# Wait for cert-manager to be ready
echo "⏳ Waiting for cert-manager to be ready..."
kubectl wait --namespace cert-manager \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/name=cert-manager \
  --timeout=300s

kubectl wait --namespace cert-manager \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/name=webhook \
  --timeout=300s

kubectl wait --namespace cert-manager \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/name=cainjector \
  --timeout=300s

# Apply ClusterIssuer
echo "🔑 Creating ClusterIssuer for Let's Encrypt..."
kubectl apply -f k8s/cert-manager-setup.yaml

echo "✅ Cluster setup complete!"
echo "🌐 You can now apply the ingress configuration"