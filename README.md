# Visitor Management System

##  Project Overview
The Visitor Management System is a full-stack web application for managing visitor records.  
It allows adding, viewing, editing, and deleting visitor details, with secure authentication and continuous integration/deployment.  

- *Frontend:* React + React Router + Axios + TailwindCSS  
- *Backend:* Node.js, Express, Mongoose (MongoDB Atlas)  
- *Deployment:* AWS EC2 (Nginx + PM2)  
- *CI/CD:* GitHub Actions → Automated build & deploy  

---

##  Features
- User Authentication (JWT based)  
- Add, View, Edit, Delete Visitors (CRUD APIs)  
- Secure API with MongoDB Atlas backend  
- Automated CI/CD pipeline with GitHub Actions  
- Deployment on AWS EC2 with PM2 + Nginx  

---

##  Live URLs
- *Frontend App (Public IP):* http://16.176.11.91 
- *API Base:* "http://16.176.11.91/api"
- *Jira Board (public link): https://connect-team-f0impqkd.atlassian.net/jira/software/projects/VM/summary?atlOrigin=eyJpIjoiNDVhZmU2MTQ0MjliNDIxZmE2YjA1MDRiZWRhYWQ0NTUiLCJwIjoiaiJ9

- *GitHub Repo:* [GitHub Repository]: https://github.com/rhythem-creator/Visitor-Management-System-.git 

---

##  Test Account (for evaluation)
firoj.thapa@gmail.com
Password: Family@26

(Or create your own test account if needed.)

---

## System Architecture (High-Level)
React SPA → Axios → Express API → MongoDB Atlas  
- Auth: JWT (Bearer token in requests)  
- Runtime on EC2: Nginx (serves frontend) + PM2 (manages backend)  



##  Repository Structure

Visitor-Management-System/
│── backend/
│   ├── src/ (controllers, models, routes)
│   ├── server.js
│   └── .env (MONGO_URI, JWT_SECRET, PORT=5001)
│
│── frontend/
│   ├── src/
│   │   ├── api/axiosConfig.js
│   │   ├── components/(Navbar, PrivateRoute).jsx
│   │   ├── context/AuthContext.jsx
│   │   └── pages/(Login, Register, Profile, VisitorsAdd, VisitorsList, VisitorsEdit).jsx
│   ├── public/
│   └── build/ (deployed to /var/www/frontend)
│
│── .github/workflows/backend-ci.yml
│── README.md

---

## Environment Variables
*Backend (.env):*

MONGO_URI=mongodb+srv://rhythem:FamilyIsLife@cluster0.pmnsrav.mongodb.net/visitormanagement?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=2J8zqkP7VN6bxzg+Wy7DQZsd3Yx8mF3Bl0kch6HYtFs=
PORT=5001

*GitHub Secrets (used by CI/CD):*
- MONGO_URI  
- JWT_SECRET  
- PORT  

---

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/Visitor-Management-System.git
cd Visitor-Management-System

2. Backend Setup 

cd backend
npm install
npm start

3. Frontend Setup 

cd ../frontend
npm install
npm run build

4. Run Locally

Backend runs on http://localhost:5001
Frontend runs on http://localhost:3000

⸻

 CI/CD Workflow

Automated using GitHub Actions:
	1.	Checkout code
	2.	Install dependencies (backend & frontend)
	3.	Run backend tests
	4.	Build frontend
	5.	Deploy to EC2 (via PM2 + Nginx)
	6.	Restart services

Workflow file: backend-ci.yml

Screenshots (see Word Report):
	•	GitHub Actions run success
	•	EC2 PM2 status
	•	Nginx reload
	The web application running on public IP assigned from EC2 instance



