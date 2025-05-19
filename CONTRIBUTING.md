# Contributing to StudyBuddy

Thank you for considering contributing to **StudyBuddy**! We welcome contributions to enhance our **production-ready** platform for collaborative study. This document outlines the process for contributing to the project, which is deployed on a **Kubernetes cluster** provisioned on **OpenStack** infrastructure.

## Table of Contents
- [Contributing to StudyBuddy](#contributing-to-studybuddy)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [How to Contribute](#how-to-contribute)
  - [Development Setup](#development-setup)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Pull Request Process](#pull-request-process)
  - [Coding Guidelines](#coding-guidelines)
  - [Issue Reporting](#issue-reporting)

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md) to ensure a _welcoming_ and _inclusive_ environment for all contributors.

## How to Contribute

We accept contributions in the form of:

- **Bug Fixes**: Address issues in the codebase.
- **New Features**: Enhance functionality for _user management_, _study groups_, _resources_, _tasks_, or _chat_.
- **Documentation**: Improve README, code comments, or guides.
- **Tests**: Add or improve unit and integration tests for **Spring Boot** services.
- **Feedback**: Suggest improvements via issues.

Contributions are deployed via the **Production Deployment Pipeline** (`.github/workflows/production.yml`), triggered by pushes to the `production` branch.

## Development Setup

To set up **StudyBuddy** for local development:

### Prerequisites
- **OpenStack Infrastructure**: A working _OpenStack_ environment (Dalmatian release, Ubuntu 24.04) with _Nova_, _Neutron_, _Cinder_, _Keystone_, _Swift_, _Placement_, _Glance_, _Heat_, and _Horizon_.
- **Kubernetes Cluster**: Deployed using an _Ansible playbook_ (e.g., `ansible-playbook -i inventory cluster.yml`).
- **OpenEBS**: Installed on the _master node_ with the `openebs-jiva` storage class.
- **Java** 21 (for Spring Boot microservices)
- **Node.js** (for Angular frontend)
- **Docker** (for containerized services)
- **Git**
- **MySQL** and **PostgreSQL** (local or containerized)
- **GitHub Secrets** (for pipeline testing):
  - `KUBE_CONFIG`: Kubernetes configuration file.
  - `DOCKER_USERNAME`: Docker Hub username.
  - `DOCKER_PASSWORD`: Docker Hub password.

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<your-repo>/studybuddy.git
   cd studybuddy
   ```

2. **Set Up OpenStack and Kubernetes**:
   - Ensure **OpenStack** (Dalmatian release) is configured with all required components.
   - Deploy the **Kubernetes** cluster using the provided **Ansible playbook**:
     ```bash
     ansible-playbook -i inventory cluster.yml
     ```
   - Install **OpenEBS** on the master node:
     ```bash
     helm repo add openebs https://openebs.github.io/charts
     helm install openebs openebs/openebs --namespace openebs --create-namespace \
       --set jiva.enabled=true
     ```

3. **Set Up Databases**:
   - Start **MySQL** and **PostgreSQL** containers locally or use Kubernetes-hosted instances:
     ```bash
     docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=<password> mysql:latest
     docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=<password> postgres:latest
     ```
   - Create databases for each service:
     ```sql
     CREATE DATABASE studybuddy_user;
     CREATE DATABASE studybuddy_group;
     CREATE DATABASE studybuddy_tasks;
     CREATE DATABASE studybuddy_chat;
     CREATE DATABASE studybuddy_resources;
     ```

4. **Configure Service Properties**:
   - For each microservice (_user-service_, _group-service_, _resources-service_, _tasks-service_, _chat-service_), create a `<service>-properties` file in `backend/<service>/src/main/resources`.
   - Example `user-service-properties`:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/studybuddy_user
     spring.datasource.username=root
     spring.datasource.password=<your-mysql-password>
     jwt.secret=<your-jwt-secret>
     ```
   - Example `chat-service-properties`:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/studybuddy_chat
     spring.datasource.username=root
     spring.datasource.password=<your-mysql-password>
     websocket.endpoint=/chat
     ```

5. **Run Services Locally**:
   - Start **Spring Boot** services using Maven:
     ```bash
     mvn spring-boot:run -pl user-service
     ```
   - Note: For production deployment, push to the `production` branch to trigger the **Production Deployment Pipeline**.

6. **Run Frontend**:
   - Navigate to the Angular frontend directory:
     ```bash
     cd frontend
     npm install
     npm start
     ```

7. **Test Pipeline Locally (Optional)**:
   - Configure **GitHub Secrets** locally for testing:
     ```bash
     export KUBE_CONFIG=$(cat ~/.kube/config)
     export DOCKER_USERNAME=<your-docker-username>
     export DOCKER_PASSWORD=<your-docker-password>
     ```
   - Simulate the pipeline using `act` (GitHub Actions local runner):
     ```bash
     act -j deploy-mysql -j build-user-service
     ```

## Pull Request Process

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes with _clear, descriptive messages_:
   ```bash
   git commit -m "Add feature: your feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a **Pull Request** on GitHub, including:
   - A _detailed description_ of the changes.
   - Reference to any related issues (e.g., Fixes #123).
   - Screenshots or logs for UI or behavioral changes.
6. Ensure all **CI/CD checks** (via the **Production Deployment Pipeline**) pass.
7. Address feedback from maintainers during review.
8. Once approved, merge into the `production` branch to trigger deployment.

## Coding Guidelines

- **Java/Spring Boot**:
  - Use **Java 21** and follow **Spring** best practices (e.g., dependency injection).
  - Write _RESTful_ endpoints with proper HTTP status codes.
  - Use **BCrypt** for password hashing and **JWT** for authentication.
  - Place configuration in `<service>-properties` files in `src/main/resources`.
- **Angular**:
  - Use _TypeScript_ with strict typing.
  - Follow Angular style guide for component structure.
- **Kubernetes**:
  - Define deployments and services in YAML files (e.g., `backend/user-service/user-service-deployment.yaml`).
  - Use **Secrets** for sensitive data, not ConfigMaps.
- **Testing**:
  - Write unit tests for **Spring Boot** services using **JUnit**.
  - Include integration tests for API endpoints.
  - Note: The pipeline skips tests (`-DskipTests`); ensure tests are run locally:
    ```bash
    mvn test
    ```
- **Commit Messages**:
  - Use _present tense_ (e.g., "Add feature" not "Added feature").
  - Reference issues (e.g., "Fix #123: Resolve login bug").
- **Code Style**:
  - Follow **Checkstyle** for Java and **ESLint**/**Prettier** for frontend code.
  - Run linters before committing:
    ```bash
    mvn checkstyle:check
    npm run lint
    ```

## Issue Reporting

If you encounter bugs or have feature suggestions:

1. Check the [Issues](https://github.com/<your-repo>/studybuddy/issues) page to avoid duplicates.
2. Open a new issue with:
   - A _clear title_ (e.g., "Bug: Login fails with invalid JWT").
   - A _detailed description_, including steps to reproduce, expected behavior, and actual behavior.
   - Relevant logs, screenshots, or environment details (e.g., OpenStack version, Kubernetes version, Java 21).
3. Use appropriate labels (e.g., `bug`, `enhancement`).

Thank you for helping make **StudyBuddy** better!