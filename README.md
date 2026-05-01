# TaskFlow: RBAC Task Management System

TaskFlow is a production-level, Role-Based Access Control (RBAC) web application built to streamline team collaboration. It structures work recursively from global Projects down to granular micro-tasks, offering distinct functionality and capabilities to Admins and assigned Users alike.

## 🚀 Tech Stack Layer
- **Frontend Engine**: React, Vite, React Router DOM
- **UI Framework**: Tailwind CSS
- **HTTP Client**: Axios (with custom JWT interceptors)
- **Backend API**: Node.js, Express.js
- **Validation**: express-validator
- **Database**: MySQL2 (Targeting strict Relational schema via Promise pools)
- **Security**: JSON Web Tokens (JWT), bcrypt (password hashing)

---

## 🔒 Role-Based Architecture
The entire routing system and explicit capabilities map tightly to a user's verified MySQL Identity.
* **Admins**: Generate Projects, Delete entire Project structures safely (CASCADING schemas), Assign Multiple Users explicitly to specific Projects, Create and Delete tasks. 
* **Standard Users**: Restricted contextually to view *only* the specific Projects they're mapped to. They possess abilities exclusively to update specific Task Progress (0-100), change Status attributes, and log specific update records.

---

## 🔥 Features
- **Project Context Generation**: A "Root-Level" folder approach where Tasks cannot exist outside the boundaries of a parent Project.
- **Bulk Assignment Models**: Instantly select and tie many independent user identities into a Project the moment you create it.
- **Live Activity Tracking Timeline**: Native SQL `JOIN` mapping that grabs exactly `who` logged `what`, appending their username natively next to iterative project progress logs.
- **Form Schema Input Validations**: No garbage gets passed into the DB; the backend explicitly utilizes `express-validator` guarding `/auth`, `/projects`, and `/tasks` with strict length formatting and bounds constraints (Like forcing `tasks_progress` to strictly be INT between 0-100).
- **Graceful Error Handling Router Models**.

---

## 🛠️ Run & Install Guide

### 1. Database Setup
Ensure you have MySQL running locally. Copy the entire contents of `/backend/schema.sql` into the terminal/workbench to construct the database rules:
```bash
CREATE DATABASE task_manager;
USE task_manager;
-- (Execute schema.sql code to build all 4 relational tables smoothly)
```

### 2. Backend Initialization
```bash
cd backend
npm install
```
Configure your `.env` connection (Use your exact MySQL pass/username):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_manager
JWT_SECRET=super_secret_jwt_key
```
Run Server natively via nodemon:
```bash
npm run start
```

### 3. Frontend Initialization
Boot up the Vite build compiler:
```bash
cd frontend
npm install
npm run dev
```
By default, the React interface leverages Axios explicitly intercepting and mapping out routes across `http://localhost:5000/api`. You can now access the full flow on `localhost:5173`. 

---

## 🏗️ Folder Structure Overview
- `/backend`: Node/Express system. Holds strict router segregation mapping logical endpoints down to `controllers/`. Includes decoupled middleware functionality.
- `/frontend`: React/Vite instance containing a dynamic page router matching `/login`, `/signup`, `/dashboard`, and `/` Landing elements respectively. Uses Context APIs caching user logic securely.
