# Contributing to StudyBuddy

Thank you for considering contributing to **StudyBuddy**! We welcome contributions from the community to help improve our platform for collaborative study. This document outlines the process for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Guidelines](#coding-guidelines)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md) to ensure a _welcoming_ and _inclusive_ environment for all contributors.

## How to Contribute

We accept contributions in the form of:

- **Bug fixes**: Address issues in the codebase.
- **New features**: Enhance functionality for _user management_, _study groups_, _resources_, _tasks_, or _chat_.
- **Documentation**: Improve README, code comments, or guides.
- **Tests**: Add or improve unit and integration tests for **Spring Boot** services.
- **Feedback**: Suggest improvements via issues.

## Development Setup

To set up **StudyBuddy** for local development:

### Prerequisites
- **Java** 17 (for Spring Boot microservices)
- **Node.js** (for Angular frontend)
- **Docker** (for containerized services)
- **Kubernetes** (e.g., Minikube for local cluster)
- **Helm** 3.x
- **MySQL** and **PostgreSQL** (local or containerized)
- **Git**

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<your-repo>/studybuddy.git
   cd studybuddy
   ```

2. **Set Up Databases**:
   - Start **MySQL** and **PostgreSQL** containers:
     ```bash
     docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=<password> mysql:latest
     docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=<password> postgres:latest
     ```

3. **Configure Environment**:
   - Copy `.env.example` to `.env` and update with your credentials (e.g., JWT secret, DB passwords).
   - Inject secrets into **Kubernetes** for local testing:
     ```bash
     kubectl create secret generic studybuddy-secrets \
       --from-literal=jwt-secret=<your-jwt-secret> \
       --from-literal=mysql-password=<your-mysql-password> \
       --from-literal=postgres-password=<your-postgres-password>
     ```

4. **Run Services Locally**:
   - Start **Spring Boot** services using Maven:
     ```bash
     mvn spring-boot:run -pl user-service
     ```
   - Alternatively, deploy to **Minikube**:
     ```bash
     helm install studybuddy ./helm/studybuddy --set environment=dev
     ```

5. **Run Frontend**:
   - Navigate to the Angular frontend directory:
     ```bash
     cd frontend
     npm install
     npm start
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
6. Ensure all **CI/CD checks** (via GitHub Actions) pass.
7. Address feedback from maintainers during review.

## Coding Guidelines

- **Java/Spring Boot**:
  - Follow **Spring** best practices (e.g., use dependency injection).
  - Write _RESTful_ endpoints with proper HTTP status codes.
  - Use **BCrypt** for password hashing and **JWT** for authentication.
- **Angular**:
  - Use _TypeScript_ with strict typing.
  - Follow Angular style guide for component structure.
- **Kubernetes**:
  - Define resources in **Helm** charts for consistency.
  - Use **Secrets** for sensitive data, not ConfigMaps.
- **Testing**:
  - Write unit tests for **Spring Boot** services using JUnit.
  - Include integration tests for API endpoints.
- **Commit Messages**:
  - Use _present tense_ (e.g., "Add feature" not "Added feature").
  - Reference issues (e.g., "Fix #123: Resolve login bug").
- **Code Style**:
  - Follow **Checkstyle** for Java and **Prettier** for frontend code.
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
   - Relevant logs, screenshots, or environment details (e.g., Kubernetes version, Java version).
3. Use appropriate labels (e.g., `bug`, `enhancement`).

Thank you for helping make **StudyBuddy** better!