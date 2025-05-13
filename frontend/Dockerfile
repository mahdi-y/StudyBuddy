FROM node:20 as builder

WORKDIR /app

# Install dependencies separately for better caching
COPY package*.json ./
RUN npm install

# Copy only the source after installing dependencies
COPY . .
RUN npm run build --prod
