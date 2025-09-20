# Docker Swarm Mode: Multi-Container Application Deployment

![Docker Logo](https://upload.wikimedia.org/wikipedia/commons/7/79/Docker_%28container_engine%29_logo.png)
![Swarm Mode](https://docs.docker.com/engine/images/swarm-mode-diagram.svg)

This repository demonstrates a real-world example of deploying a multi-container application using **Docker Swarm Mode** — a native clustering and orchestration tool built into Docker. It showcases how to manage scalable, resilient services across multiple nodes using Docker's declarative service model.

> 🔧 Perfect for developers and DevOps engineers looking to understand container orchestration without Kubernetes overhead.

---

## 📁 Project Overview

This project sets up a simple yet complete web application stack orchestrated via Docker Swarm. The architecture includes:

- A **Node.js backend API**
- A **React frontend** (built as a static server)
- A **MongoDB database**
- Reverse proxy using **Nginx** for load balancing and routing
- Fully configured with **Docker Compose (v3)** for Swarm deployment

The goal is to illustrate production-like deployment patterns including:
- Service scaling
- Overlay networking
- Secrets & configurations management
- Rolling updates
- High availability

---

## ⚙️ Features

✅ Orchestration with Docker Swarm  
✅ Multi-service Architecture (Frontend, Backend, DB, Proxy)  
✅ Zero-downtime rolling updates  
✅ Load balancing via Nginx reverse proxy  
✅ Persistent storage using volumes  
✅ Secure network isolation via overlay networks  
✅ Environment-specific configuration using Docker Configs & Secrets *(optional extension)*  
✅ CI/CD ready structure  

---

## 🐳 Prerequisites

Before getting started, ensure you have the following installed:

- [Docker Engine](https://docs.docker.com/engine/install/) >= 18.06
- [Docker Compose](https://docs.docker.com/compose/install/) >= 1.29
- Initialize Swarm mode:  
  ```bash
  docker swarm init
