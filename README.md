# 5Jobs – Online Job Recruitment Platform

5Jobs is a full-stack job recruitment web application that connects candidates and employers through a modern, role-based hiring platform.

---

## Introduction

The goal of this project is to build an online recruitment system that supports real-world job searching and hiring workflows.
The system is developed with a clear separation between backend and frontend to ensure scalability, maintainability, and clean architecture.

---

## Project Structure

```
job-site/
├── job-site-backend/        Node.js + Express REST API
└── job-site-frontend/       React + Vite frontend
```

---

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Token (JWT)
- Multer (file upload)

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios

---

## Core Features

### Candidate
- User registration and authentication
- Browse and search job listings
- Filter jobs by multiple criteria (city, industry, salary, experience, job type)
- View detailed job information
- View company profiles
- Apply for jobs with CV upload
- Manage personal profile
- Track submitted job applications

### Employer
- Employer registration and authentication
- Create and update company profile
- Post new job listings
- Edit and delete job postings
- View candidate applications
- Manage job recruitment process

### Admin
- Admin authentication
- Manage users (candidates and employers)
- Manage job postings
- Manage company information
- Monitor overall system activities

---

## Job Search and Filtering

The platform supports advanced job filtering based on:
- Job title and keywords
- City and region
- Industry
- Salary range
- Experience level
- Job type (Full-time, Part-time, Internship, Remote)

---

## Authentication and Authorization

- JWT-based authentication is used for secure access
- Role-based access control for Candidate, Employer, and Admin
- Protected routes on both backend and frontend
- Secure password hashing and validation

---

## File Upload

- Candidates can upload CV files when applying for jobs
- Multer is used for handling file uploads
- Uploaded files are stored securely on the server

---

## API Design

- RESTful API architecture
- Clear separation between routes, controllers, and models
- Error handling with centralized middleware
- Async handling for database operations

---

## Frontend Architecture

- Built with React and Vite for fast development
- Tailwind CSS for responsive and modern UI design
- Axios for API communication
- React Context and custom hooks for global state management
- React Router for client-side routing

---

## Installation and Running Project

### Backend

1. Navigate to job-site-backend directory
   ```bash
   cd job-site-backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure MongoDB connection and environment variables in `.env`

4. Run the server
   ```bash
   npm start      # Production
   npm run dev    # Development with nodemon
   ```

### Frontend

1. Navigate to job-site-frontend directory
   ```bash
   cd job-site-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Build for production
   ```bash
   npm run build
   ```

---

## Future Improvements

- Advanced search with AI-based recommendations
- Email notifications for job applications
- Resume parsing and skill matching
- Admin analytics dashboard
- Deployment with Docker and CI/CD pipeline



