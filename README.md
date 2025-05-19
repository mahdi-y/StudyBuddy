# StudyBuddy

**StudyBuddy** is a collaborative platform designed to enhance group study experiences through _user management_, _study group organization_, _resource sharing_, _task management_, and _real-time chat_. Built with a **microservices architecture**, it leverages **Spring Boot**, **MySQL**, **PostgreSQL**, **WebSockets**, and **Kubernetes** for scalability, security, and maintainability. The platform is **production-ready** and deployed on a **Kubernetes cluster** provisioned on **OpenStack** infrastructure.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Microservices](#microservices)
- [Tech Stack](#tech-stack)
- [Security](#security)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Setup Instructions](#setup-instructions)
- [Database Setup](#database-setup)
- [CI/CD](#cicd)
- [Monitoring and Logging](#monitoring-and-logging)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Project Status](#project-status)

## Overview

**StudyBuddy** enables students to form _study groups_, share _resources_, manage _tasks_, and communicate in _real time_. Its **microservices-based design** ensures modularity, while **Kubernetes** on **OpenStack** provides robust deployment and scaling capabilities. **JWT-based authentication** and **Kubernetes Secrets** ensure secure operations.

## Features

- **User Management**: Register, login, manage profiles, and authenticate with _JWT_.
- **Study Groups**: Create, join, and manage groups with _role-based permissions_ (owner, admin, member, guest).
- **Resource Sharing**: Upload, categorize, and version study materials with access restricted to group members.
- **Task Management**: Create, assign, and track tasks with _deadlines_ and _priorities_.
- **Real-Time Chat**: Group and private messaging via _WebSockets_ with persistent chat history.
- **Scalable Architecture**: Deployed on _Kubernetes_ with persistent storage and ingress routing.

## Architecture

**StudyBuddy** follows a **microservices architecture**, with each service handling a specific domain. Services communicate via _REST_ or _WebSockets_ and are deployed in a **Kubernetes cluster** backed by **OpenStack** infrastructure running the **Dalmatian** release on **Ubuntu 24.04**. The cluster is provisioned using an **Ansible playbook**. For a detailed architecture diagram, see the [StudyBuddy Architecture Diagram](https://miro.com/app/board/uXjVI69XbuA=/?share_link_id=764135954399).

### Microservices

1. **User Management Service**
   - Handles _registration_, _login_, and _profile management_.
   - Uses **JWT** for stateless authentication, with secrets managed via _Kubernetes Secrets_.
   - Stores user data in a **MySQL** database.
   - Endpoints: `/api/doRegister`, `/api/login`.
   - Configuration: Requires `user-service-properties` file in the backend `src/main/resources` folder.

2. **Study Group Service**
   - Manages _group creation_, _membership_, and _role-based permissions_.
   - Integrates with **Chat Service** for synchronized communication.
   - Stores group data in **MySQL**.
   - Configuration: Requires `group-service-properties` file in the backend `src/main/resources` folder.

3. **Resources Service**
   - Centralized repository for study materials with _upload/download_, _categorization_, and _versioning_.
   - Metadata in **PostgreSQL**; files stored in _Kubernetes Persistent Volumes_ (**OpenEBS** on **OpenStack**).
   - Restricts access to _group members_.
   - Configuration: Requires `resources-service-properties` file in the backend `src/main/resources` folder.

4. **Tasks Service**
   - Supports _task CRUD operations_, _deadlines_, and _status tracking_.
   - Integrates with **Study Group Service** for membership validation.
   - Stores task data in **MySQL**.
   - Configuration: Requires `tasks-service-properties` file in the backend `src/main/resources` folder.

5. **Chat Service**
   - Provides _real-time_ group and private messaging via **WebSockets**.
   - Persists _chat history_ in **MySQL**.
   - Validates memberships through **Study Group Service**.
   - Configuration: Requires `chat-service-properties` file in the backend `src/main/resources` folder.

## Tech Stack

- **Backend**: _Spring Boot_ (Java 21)
- **Databases**: _MySQL_ (User, Group, Tasks, Chat), _PostgreSQL_ (Resources)
- **Frontend**: _Angular_ (served via _Kubernetes Ingress_)
- **Authentication**: _JWT_ (HMAC-SHA256, managed via _Kubernetes Secrets_)
- **Real-Time Communication**: _Spring WebSockets_
- **Orchestration**: _Kubernetes_ (Pods, Deployments, Services, Ingress)
- **Storage**: _Kubernetes Persistent Volumes_ (_OpenEBS_ on _OpenStack_)
- **OpenStack Components**: _Nova_, _Neutron_, _Cinder_, _Keystone_, _Swift_, _Placement_, _Glance_, _Heat_, _Horizon_ (Dalmatian release, Ubuntu 24.04)
- **CI/CD**: _GitHub Actions_ (self-hosted runner in cluster)
- **Configuration**: _Kubernetes ConfigMaps_, _Secrets_
- **Cluster Deployment**: _Ansible playbook_
- **Monitoring**: _Prometheus_, _Grafana_

## Security

- **JWT Authentication**: _Stateless_, signed tokens with short expiration (15-60 minutes). Validated on every request.
- **Password Hashing**: _BCrypt_ for secure credential storage.
- **Kubernetes Secrets**: Store sensitive data (_JWT keys_, _DB credentials_) encrypted at rest.
- **RBAC**: _Kubernetes role-based access controls_ for secret access.
- **TLS**: _Ingress controller_ (_NGINX_) handles _HTTPS_ traffic with _TLS termination_.
- **Access Control**: Services enforce _group membership_ and _role-based permissions_.

## Kubernetes Deployment

**StudyBuddy** is deployed on a **Kubernetes cluster** provisioned on **OpenStack** (Dalmatian release, Ubuntu 24.04) using an **Ansible playbook**. The following components are used:

- **Pods**: Run _microservice containers_.
- **Deployments**: Ensure _pod replicas_, _rolling updates_, and _self-healing_.
- **Services**: Provide stable _IPs/DNS_ for inter-service communication.
- **Persistent Volumes (PV) / PVCs**: Backed by _OpenEBS_ on _OpenStack_ for _database_ and _file storage_.
- **Ingress**: _NGINX controller_ routes external traffic to services (e.g., `/api/user` to _User Service_).
- **Namespaces**: Separate `studybuddy-prod` and `studybuddy-dev` environments.
- **ConfigMaps**: Store _non-sensitive configurations_.
- **Secrets**: Securely inject _sensitive data_ into containers.
- **GitHub Actions Runner**: Self-hosted runner deployed on the _master node_ for CI/CD.

**Example Ingress Configuration**:
```yaml
server {
    listen 80;
    server_name localhost;

    # Serve Angular app
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location ^~ /api/ {
        proxy_pass http://user-service:8083;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ^~ /api/users {
        proxy_pass http://user-service:8083;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ^~ /api/auth {
        proxy_pass http://user-service:8083;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Setup Instructions

### Prerequisites
- **OpenStack Infrastructure**: A working _OpenStack_ environment (Dalmatian release, Ubuntu 24.04) with components _Nova_, _Neutron_, _Cinder_, _Keystone_, _Swift_, _Placement_, _Glance_, _Heat_, and _Horizon_.
- **Kubernetes Cluster**: A fully configured cluster deployed using an _Ansible playbook_.
- **OpenEBS**: Installed on the _master node_ for dynamic storage provisioning.
- **GitHub Actions Runner**: Self-hosted runner installed on the _master node_.
- **GitHub Secrets**:
  - `KUBE_CONFIG`: Kubernetes configuration file for cluster access.
  - `DOCKER_USERNAME`: Docker Hub username.
  - `DOCKER_PASSWORD`: Docker Hub password.
- **Docker**
- **Git**
- **MySQL** and **PostgreSQL** instances (deployed via the CI/CD pipeline).
- **NGINX Ingress Controller**

### Steps
1. **Set Up OpenStack**:
   - Ensure **OpenStack** (Dalmatian release) is running on **Ubuntu 24.04** with all required components (_Nova_, _Neutron_, _Cinder_, _Keystone_, _Swift_, _Placement_, _Glance_, _Heat_, _Horizon_).
   - Verify access to the **Horizon** dashboard and configure **Keystone** for authentication.

2. **Deploy Kubernetes Cluster**:
   - Use the provided **Ansible playbook** to deploy the **Kubernetes** cluster on **OpenStack**:
     ```bash
     ansible-playbook -i inventory cluster.yml
     ```
   - Ensure the cluster is accessible via `kubectl` and the master node is configured.

3. **Set Up OpenEBS**:
   - Install **OpenEBS** on the master node using the `openebs-jiva` storage class:
     ```bash
     helm repo add openebs https://openebs.github.io/charts
     helm install openebs openebs/openebs --namespace openebs --create-namespace \
       --set jiva.enabled=true
     ```

4. **Clone the Repository**:
   ```bash
   git clone https://github.com/<your-repo>/studybuddy.git
   cd studybuddy
   ```

5. **Configure Service Properties**:
   - For each microservice (_user-service_, _group-service_, _resources-service_, _tasks-service_, _chat-service_), create a `<service>-properties` file in the backend `src/main/resources` folder.
   - Example `user-service-properties`:
     ```properties
     spring.datasource.url=jdbc:mysql://mysql:3306/studybuddy_user
     spring.datasource.username=root
     spring.datasource.password=<your-mysql-password>
     jwt.secret=<your-jwt-secret>
     ```
   - Example `chat-service-properties`:
     ```properties
     spring.datasource.url=jdbc:mysql://mysql:3306/studybuddy_chat
     spring.datasource.username=root
     spring.datasource.password=<your-mysql-password>
     websocket.endpoint=/chat
     ```
   - Repeat for other services, updating database URLs and credentials.

6. **Configure GitHub Secrets**:
   - Add the following to GitHub Secrets in your repository (_Settings_ > _Secrets and variables_ > _Actions_):
     - `KUBE_CONFIG`: Contents of your `~/.kube/config` file.
     - `DOCKER_USERNAME`: Your Docker Hub username.
     - `DOCKER_PASSWORD`: Your Docker Hub password.
   - Optionally, create a service account for secure access:
     ```bash
     kubectl create sa github-actions -n studybuddy-prod
     kubectl create clusterrolebinding github-actions-binding \
       --clusterrole=edit --serviceaccount=studybuddy-prod:github-actions
     ```

7. **Set Up GitHub Actions Runner**:
   - Deploy a self-hosted **GitHub Actions runner** on the master node:
     ```bash
     kubectl apply -f https://github.com/actions/runner-controller/releases/latest/download/actions-runner-controller.yaml
     ```
   - Configure the runner in your GitHub repository under _Settings_ > _Actions_ > _Runners_ > _New self-hosted runner_, following the provided instructions.
   - Ensure the runner is running in the `studybuddy-prod` namespace:
     ```bash
     kubectl get pods -n studybuddy-prod
     ```

8. **Configure Secrets**:
   - Create **Kubernetes Secrets** for _JWT keys_ and _DB credentials_:
     ```bash
     kubectl create secret generic studybuddy-secrets \
       --from-literal=jwt-secret=<your-jwt-secret> \
       --from-literal=mysql-password=<your-mysql-password> \
       --from-literal=postgres-password=<your-postgres-password>
     ```

9. **Trigger Deployment**:
   - Push changes to the `production` branch to trigger the **Production Deployment Pipeline**:
     ```bash
     git push origin production
     ```
   - The pipeline will handle MySQL deployment, building/pushing Docker images, and applying Kubernetes manifests.

10. **Verify Deployment**:
    - Check that pods and services are running:
      ```bash
      kubectl get pods -n studybuddy-prod
      kubectl get ingress -n studybuddy-prod
      ```

11. **Access the Application**:
    - Open `https://studybuddy.example.com` in a browser (ensure _DNS_ is configured).

## Database Setup

The **Production Deployment Pipeline** automatically deploys **MySQL** instances for the _User_, _Study Group_, _Tasks_, and _Chat_ services. For **PostgreSQL** (Resources service).

## CI/CD

The **Production Deployment Pipeline** (defined in `.github/workflows/production.yml`) automates the deployment process. It is triggered by pushes to the `production` branch, specifically for changes in `frontend/` or `backend/` directories. The pipeline:

- **Deploys MySQL**: Sets up MySQL instances for _User_, _Study Group_, _Tasks_, and _Chat_ services using Kubernetes manifests.
- **Builds and Pushes Images**: Compiles **Spring Boot** microservices (Java 21) and the **Angular** frontend, builds Docker images, and pushes them to **Docker Hub** (e.g., `<DOCKER_USERNAME>/user-service:latest`).
- **Deploys Services**: Applies Kubernetes deployments and services for each microservice and the frontend, forcing redeployment by updating a `REVISION` environment variable.
- **Ensures Rollout**: Waits for deployments to complete successfully.

**Prerequisites**:
- GitHub Secrets: `KUBE_CONFIG`, `DOCKER_USERNAME`, `DOCKER_PASSWORD`.
- Self-hosted **GitHub Actions runner** on the master node.

To deploy, push to the `production` branch:
```bash
git push origin production
```

Monitor the pipeline in the GitHub **Actions** tab of your repository.

## Monitoring

- **Monitoring**: _Prometheus_ and _Grafana_ for metrics and alerting.

## Troubleshooting

- **OpenEBS PVC Not Bound**:
  - Ensure **OpenEBS** is installed and the `openebs-jiva` storage class is specified.
  - Check master node taints: `kubectl describe node <master-node>`.
  - Verify OpenStack **Cinder** integration: `openstack volume list`.
- **GitHub Actions Runner Offline**:
  - Verify the runner pod: `kubectl get pods -n studybuddy-prod`.
  - Check GitHub repository settings for runner registration.
  - Ensure **Neutron** networking allows runner connectivity.
- **Deployment Fails**:
  - View pod logs: `kubectl logs <pod-name> -n studybuddy-prod`.
  - Ensure `<service>-properties` files are correctly configured in `src/main/resources`.
  - Check **Keystone** authentication for OpenStack resources.
- **Database Connection Errors**:
  - Verify **MySQL** and **PostgreSQL** services: `kubectl get svc -n studybuddy-prod`.
  - Ensure database credentials match `<service>-properties` files.
- **OpenStack Issues**:
  - Use **Horizon** to debug resource allocation (e.g., Nova instances, Swift storage).
  - Check **Heat** stack status: `openstack stack list`.
- **Pipeline Failures**:
  - Check GitHub Actions logs for errors in MySQL deployment, image builds, or Kubernetes apply steps.
  - Verify `KUBE_CONFIG` and Docker Hub credentials in GitHub Secrets.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a **Pull Request**.

Please follow the [**Code of Conduct**](./CODE_OF_CONDUCT.md) and review the [**Contributing Guidelines**](./CONTRIBUTING.md).

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

## Project Status

**StudyBuddy** is **production-ready** as of May 2025, running on **OpenStack Dalmatian** and **Kubernetes**. For issues or feature requests, contact maintainers via [GitHub Issues](https://github.com/<your-repo>/studybuddy/issues). Future enhancements include _resource versioning_, _Prometheus/Grafana monitoring_, and _ELK Stack logging_.
