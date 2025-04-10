# Country API Service

A secure middleware service providing country data from external APIs, featuring user authentication, API key management, and a React frontend.

## Overview

- **Purpose**: Fetch and manage country information (name, currency, capital, languages, flag).
- **Deployment**: Fully containerized with Docker for easy setup.
- **Access**: Includes a user-friendly frontend and admin dashboard.

## Key Features

- **Authentication**: User registration, login, and logout with JWT.
- **API Keys**: Generate, track, and revoke API keys for secure access.
- **Country Data**: Retrieve detailed country information via API.
- **Admin Tools**: Manage users and API keys (admin-only).
- **Containerization**: Deploy with Docker and Docker Compose.

## Tech Stack

- **Backend**: Node.js, Express, Sequelize, SQLite
- **Frontend**: React, React Bootstrap
- **Security**: JWT, API keys
- **Deployment**: Docker, Docker Compose

## Prerequisites

- Docker & Docker Compose
- Node.js (v18+ recommended)
- Git

## Getting Started

1. **Clone the Repository**:
   ```bash
   git clone git@github.com:GayanthaSandeep16/serversideCW.git
   cd serversideCW