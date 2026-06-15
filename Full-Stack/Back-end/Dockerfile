FROM node:20-slim

# Install system dependencies for python and compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set up Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Copy python dependencies
COPY AI/requirements.txt ./AI/requirements.txt

# Optimize: Use tensorflow-cpu instead of tensorflow to reduce image size and improve installation speed
RUN sed -i 's/tensorflow/tensorflow-cpu/g' AI/requirements.txt && \
    pip install --no-cache-dir -r ./AI/requirements.txt

# Copy node package configuration
COPY package*.json ./
RUN npm install --production

# Copy all application files
COPY . .

# Expose backend port
EXPOSE 5000

# Run database seeder first, then start the server
CMD ["sh", "-c", "node seed-admin.js && node server.js"]
