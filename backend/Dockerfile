# Use official Python image as base
FROM python:3.9-slim

# Set working directory inside container
WORKDIR /app

# Copy requirements first and install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything into the container
COPY . .

# Environment variables
ENV FLASK_APP=main.py
ENV FLASK_RUN_HOST=0.0.0.0

# Expose Flask port
EXPOSE 5000

# Run using plain Python, not flask CLI
CMD ["python", "main.py"]
