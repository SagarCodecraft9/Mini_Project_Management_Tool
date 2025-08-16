Description:
A full-stack web application for managing student or team mini-projects. It helps users create projects, assign tasks, and track progress with secure user authentication using JWT (JSON Web Tokens).


🔧 Tech Stack

Frontend: React.js

Backend: Node.js, Express.js

Authentication: JWT-based secure login system

Database: MySQL (Workbench) (or JSON for demo/local)

Version Control: Git & GitHub



🚀 Key Features

🔐 JWT Authentication (signup, login, protected routes)

📁 Project and task management (CRUD operations)

👥 Role-based access control (Admin, Member)

📊 Project dashboard with real-time progress tracking

💬 Team collaboration (comments/notes per task)

📱 Responsive UI with reusable components

CRUD Operations:

POST /signup User registration

POST /login User login, returns JWT token

GET /tasks - Get tasks for authenticated user (requires Authorization header with Bearer token)

POST /tasks - Add new task (requires Authorization header)

PUT /tasks/: id - Update task by ID (requires Authorization header)

DELETE /tasks/: id - Delete task by ID (requires Authorization header)



📁 Folder Structure

Mini_Project_Management_Tool/
├── frontend/    # React app (UI)
│   └── src/components/
├── server/      # Node.js + Express backend
│   ├── routes/
│   ├── controllers/
│   ├── middleware/auth.js   # JWT token verification
│   └── models/
