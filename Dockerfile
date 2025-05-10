# Use a base Ubuntu image
FROM ubuntu:20.04

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    sudo \
    lsb-release \
    ca-certificates \
    unzip

# Set the working directory
WORKDIR /actions-runner

# Download the GitHub Actions Runner binary
RUN curl -o actions-runner.tar.gz -L https://github.com/actions/runner/releases/download/v2.309.0/actions-runner-linux-x64-2.309.0.tar.gz \
    && tar xzf actions-runner.tar.gz \
    && rm -rf actions-runner.tar.gz

# Install the runner dependencies
RUN ./bin/installdependencies.sh

# Set the default command to run the runner
CMD ["./run.sh"]
