# StudyBuddy

> **A collaborative, microservices-based platform for students to form study groups, share resources, manage tasks, and communicate in real time.**

<div align="center">
  <!-- Badges for quick stack overview -->
  <img src="https://img.shields.io/badge/Cloud-OpenStack-ED1944?style=for-the-badge&logo=openstack&logoColor=white" />
  <img src="https://img.shields.io/badge/Orchestration-Kubernetes-326ce5?style=for-the-badge&logo=kubernetes&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
</div>



<!-- Optional: Mermaid diagram for architecture -->
<details>
<summary><b>Click to view architecture diagram</b></summary>

```mermaid
flowchart LR
    subgraph Cloud
      A[OpenStack]
      B[Kubernetes]
    end
    subgraph Backend
      C[Spring Boot]
      D[MySQL]
      E[PostgreSQL]
    end
    subgraph Frontend
      F[Angular]
    end
    A --> B
    B --> C
    C --> D
    C --> E
    B --> F
```
</details>

---

## Table of Contents

- [StudyBuddy](#studybuddy)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Microservices](#microservices)
  - [Tech Stack](#tech-stack)
  - [Security](#security)
  - [Kubernetes Deployment](#kubernetes-deployment)
  - [Setup Instructions](#setup-instructions)
    - [Prerequisites](#prerequisites)
    - [Quick Start](#quick-start)
  - [Database Setup](#database-setup)
  - [CI/CD](#cicd)
  - [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)
  - [Contributing](#contributing)
  - [License](#license)
  - [Project Status](#project-status)

---

## Overview

**StudyBuddy** is built with **Spring Boot**, **Angular**, **MySQL**, **PostgreSQL**, and **WebSockets** for scalability, security, and seamless deployment on **Kubernetes** over **OpenStack**.

**Key Capabilities:**
- Form and manage study groups with role-based permissions
- Share and categorize resources securely
- Assign and track tasks with deadlines and priorities
- Communicate via real-time group and private chat

The modular microservices architecture ensures maintainability and scalability, while **JWT authentication** and **Kubernetes Secrets** provide robust security.

---

## Features

- **User Management:** Registration, login, profile management, JWT-based authentication
- **Study Groups:** Create, join, and manage groups with owner, admin, member, and guest roles
- **Resource Sharing:** Upload, categorize, and version study materials; access restricted to group members
- **Task Management:** Create, assign, and track tasks with deadlines and priorities
- **Real-Time Chat:** Group and private messaging via WebSockets with persistent chat history
- **Scalable Deployment:** Runs on Kubernetes with persistent storage and ingress routing

---

## Architecture

StudyBuddy uses a **microservices** approach, with each service responsible for a specific domain. Services communicate via REST or WebSockets and are deployed in a Kubernetes cluster on OpenStack (Dalmatian, Ubuntu 24.04), provisioned using Ansible.

[View Architecture Diagram](https://miro.com/app/board/uXjVI69XbuA=/?share_link_id=764135954399)

---

## Microservices

| Service             | Description                                         | Database    | Key Endpoints                  | Config File                   |
|---------------------|-----------------------------------------------------|-------------|-------------------------------|-------------------------------|
| User Management     | Registration, login, profile, JWT authentication    | MySQL       | `/api/doRegister`, `/api/login`| `user-service-properties`     |
| Study Group         | Group creation, membership, role management         | MySQL       | `/api/groups`                  | `group-service-properties`    |
| Resources           | Upload/download, categorization, versioning         | PostgreSQL  | `/api/ressources`              | `resources-service-properties`|
| Tasks               | CRUD, deadlines, status tracking, group validation  | MySQL       | `/api/tasks`                   | `tasks-service-properties`    |
| Chat                | Real-time messaging, chat history, membership check | MySQL       | `/api/chat`                    | `chat-service-properties`     |

> All configuration files are placed in each service’s `src/main/resources` directory.

---

## Tech Stack

- **Backend:** Spring Boot (Java 21)
- **Frontend:** Angular (served via Kubernetes Ingress)
- **Databases:** MySQL (User, Group, Tasks, Chat), PostgreSQL (Resources)
- **Authentication:** JWT (HMAC-SHA256, managed via Kubernetes Secrets)
- **Real-Time:** Spring WebSockets
- **Orchestration:** Kubernetes (Pods, Deployments, Services, Ingress)
- **Storage:** Kubernetes Persistent Volumes (OpenEBS on OpenStack)
- **CI/CD:** GitHub Actions (self-hosted runner)
- **Monitoring:** Prometheus, Grafana

---

## Security

- **JWT Authentication:** Stateless, short-lived tokens (15–60 min), validated on every request
- **Password Hashing:** BCrypt for secure credential storage
- **Kubernetes Secrets:** Encrypted storage for JWT keys and DB credentials
- **RBAC:** Kubernetes role-based access controls
- **TLS:** NGINX Ingress controller for HTTPS with TLS termination
- **Access Control:** Enforced group membership and role-based permissions

---

## Kubernetes Deployment

StudyBuddy is deployed on a Kubernetes cluster provisioned on OpenStack (Dalmatian, Ubuntu 24.04) using Ansible.

**Key Components:**
- Pods/Deployments: Run and manage microservice containers
- Services: Stable IPs/DNS for inter-service communication
- Persistent Volumes: OpenEBS-backed storage for databases and files
- Ingress: NGINX controller routes external traffic
- Namespaces: Separate `studybuddy-prod` and `studybuddy-dev`
- ConfigMaps/Secrets: Store configuration and sensitive data
- GitHub Actions Runner: Self-hosted for CI/CD

**Sample Ingress Configuration:**
```yaml
location ^~ /api/users {
  proxy_pass http://user-service:8083;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## Setup Instructions

### Prerequisites

- OpenStack (Dalmatian, Ubuntu 24.04) with Nova, Neutron, Cinder, Keystone, Swift, Placement, Glance, Heat, Horizon
- Kubernetes cluster (deployed via Ansible)
- OpenEBS (Jiva storage class)
- Docker, Git
- MySQL and PostgreSQL (deployed via CI/CD)
- NGINX Ingress Controller
- GitHub Actions self-hosted runner
- GitHub Secrets: `KUBE_CONFIG`, `DOCKER_USERNAME`, `DOCKER_PASSWORD`

### Quick Start

1. **Clone the Repository**
   ```sh
   git clone https://github.com/<your-repo>/studybuddy.git
   cd studybuddy
   ```

2. **Configure Service Properties**
   - Create `<service>-properties` files in each backend service’s `src/main/resources` directory.
   - Example for user service:
     ```properties
     spring.datasource.url=jdbc:mysql://mysql:3306/studybuddy_user
     spring.datasource.username=root
     spring.datasource.password=<your-mysql-password>
     jwt.secret=<your-jwt-secret>
     ```

3. **Set Up Kubernetes Secrets**
   ```sh
   kubectl create secret generic studybuddy-secrets \
     --from-literal=jwt-secret=<your-jwt-secret> \
     --from-literal=mysql-password=<your-mysql-password> \
     --from-literal=postgres-password=<your-postgres-password>
   ```

4. **Deploy with CI/CD**
   - Push to the `production` branch to trigger deployment:
     ```sh
     git push origin production
     ```
   - Monitor deployment in GitHub Actions.

5. **Verify Deployment**
   ```sh
   kubectl get pods -n studybuddy-prod
   kubectl get ingress -n studybuddy-prod
   ```

6. **Access the Application**
   - Open `https://studybuddy.example.com` in your browser.

---

## Database Setup

MySQL and PostgreSQL instances are automatically deployed by the CI/CD pipeline for each service. Ensure credentials in `<service>-properties` match those in Kubernetes Secrets.

---

## CI/CD

- **Pipeline:** Defined in `.github/workflows/production.yml`
- **Triggers:** Pushes to `production` branch
- **Steps:** Deploys databases, builds/pushes Docker images, applies Kubernetes manifests, ensures rollout

Monitor pipeline status in the GitHub Actions tab.

---

## Monitoring and Troubleshooting

- **Monitoring:** Prometheus and Grafana dashboards
- **Troubleshooting:**
  - PVC Not Bound: Check OpenEBS and storage class
  - Runner Offline: Verify runner pod and GitHub registration
  - Deployment Fails: Inspect pod logs and configuration files
  - Database Errors: Check service credentials and DB status
  - OpenStack Issues: Use Horizon and CLI tools for diagnostics

---

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes with descriptive messages
4. Push to your branch and open a Pull Request

See our [Code of Conduct](./CODE_OF_CONDUCT.md) and [Contributing Guidelines](./CONTRIBUTING.md).

---

## License

This project is licensed under the **MIT License**. See [LICENSE.md](./LICENSE.md) for details.

---

## Project Status

**Production-ready** as of May 2025, running on OpenStack Dalmatian and Kubernetes.  
For issues or feature requests, use [GitHub Issues](https://github.com/<your-repo>/studybuddy/issues).

**Planned enhancements:** Resource versioning  and ELK Stack logging.
