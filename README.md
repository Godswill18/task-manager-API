📘 Task Management API
A robust RESTful API for managing tasks with role-based access, time tracking, JWT authentication, and PostgreSQL persistence using Sequelize ORM.

🚀 Features
✅ JWT-based user authentication

✅ Admin vs user access control

✅ Task creation, updates, deletion, and reporting

✅ Time spent calculation via timestamps

✅ Pagination and filtering

✅ Sequelize migrations for database versioning

📦 Tech Stack
Runtime: Node.js

Framework: Express.js

Database: PostgreSQL

ORM: Sequelize

Auth: JWT, bcrypt

Validation: express-validator

Dev Tools: Sequelize CLI, Nodemon

⚙️ Installation Guide
1. 📁 Clone & Install

git clone 
cd task-manager-api
npm install
npm run migration
2. 🔐 Setup Environment
Create a .env file at the root:

PORT=8000
PG_HOST=localhost
PG_PORT=5432
PG_USER=your_pg_user
PG_PASSWORD=your_pg_password
PG_DATABASE=taskmanager_db
JWT_SECRET=your_jwt_secret

3. 🧱 Setup Sequelize and Migrations
Initialize Sequelize CLI (if not done yet)

npx sequelize-cli init
This creates:
npm run migration to create postgres tables

4. 🏁 Start the Server
npm run dev
🧪 API Reference
🔐 Auth Routes
Method	Endpoint	Description
POST	/register	Register a new user
POST	/login	    Login with JWT

📋 Task Routes
Method	        Endpoint	            Description
GET	            /tasks	            Get all tasks (with pagination + filtering)
POST	        /tasks	            Create a task (admin only)
PUT	            /tasks/:id	        Update task (admin or status-only by user)
DELETE	        /tasks/:id	        Delete task (admin only)
GET	            /tasks/report	    Summary report with total time spent
GET	            /tasks/:id/time	    Time spent on a specific task

🔍 Query Parameters (GET /tasks)
Param	Type	Example	                    Description
page	Number	/tasks?page=1	        Page number
limit	Number	/tasks?limit=5	        Number of items per page
status	String	/tasks?status=pending	Filter by status

🗃️ Sequelize Folder Structure

├── config/
│   └── config.js         # Sequelize DB config
├── models/
│   ├── index.js          # Sequelize model loader
│   └── user.js
│   └── task.js
├── migrations/
│   └── xxxx-create-user.js
│   └── xxxx-create-task.js

🧰 Scripts
Command	                        Description
npm run dev	                    Start in development mode
npx sequelize-cli db:migrate	Run all migrations
npx sequelize-cli db:seed:all	Seed initial data (optional)
npx sequelize-cli db:create	    Create the database

✅ Requirements
Node.js v16+

PostgreSQL

Sequelize CLI installed globally or via npx