FROM python:3.9

# Set working directory
WORKDIR /app

# Copy and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the Django project
COPY . .

# Run Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

FROM ubuntu:latest

# Install necessary packages
RUN apt-get update && apt-get install -y \blender
