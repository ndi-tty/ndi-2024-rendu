build:
  docker build --push -t ghcr.io/ndi-tty/frontend-2024/frontend:latest frontend
  docker build --push -t ghcr.io/ndi-tty/frontend-2024/backend:latest captcha-api

deploy:
  helmfile sync -f kubernetes/helmfile.yaml --selector name=frontend
  helmfile sync -f kubernetes/helmfile.yaml --selector name=backend
  kubectl rollout restart deployment/frontend -n ndi-tty
  kubectl rollout restart deployment/backend-captcha-api -n ndi-tty
