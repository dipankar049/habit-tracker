# Habit Tracker App

A full-stack MERN application to help users create, track, and analyze their habits.  
Users can set routines, add special tasks via a calendar, log time spent, and view summaries to track progress.

---

## Features

- **User Authentication**
  - Signup, Login, and JWT-based authentication
  - Password hashing with bcrypt

- **Routine Management**
  - Add, edit, delete weekly routine tasks
  - Track status as `pending` or `completed`
  - Reset routines if needed

- **Daily Task Logs**
  - Log completion of tasks with actual time spent
  - View tasks for the current day

- **Statistics & Summaries**
  - Weekly, Monthly, and Yearly summaries
  - Time spent vs planned tracking
  - Progress visualization

- **Special Tasks Calendar**
  - View, add, edit, and delete special one-time events
  - Supports event start/end date
  - Click to view event details, delete with confirmation modal
  - Double-click/long-press (on supported devices) to quickly add events

- **Quotes**
  - Daily motivational quote display on homepage

---

## Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- React Big Calendar
- Axios
- React Modal

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Bcrypt password hashing

**Deployment**
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## Project Structure

```
habit-tracker-app/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── vite.config.js
└── README.md
```

---

## Environment Variables

### Backend (`.env`)
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
```

### Frontend (`.env`)
```
VITE_NODE_URI=https://your-backend-url.com
```

---

## Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/dipankar049/habit-tracker-app.git
cd habit-tracker-app
```

### 2️⃣ Install dependencies
**Backend**
```bash
cd backend
npm install
```

**Frontend**
```bash
cd ../frontend
npm install
```

### 3️⃣ Run the application locally
**Backend**
```bash
cd backend
npm run dev
```

**Frontend**
```bash
cd ../frontend
npm run dev
```

---

## API Routes

### Auth Routes (`/api/auth`)
- `POST /register` → Create account
- `POST /login` → Login and get JWT

### Routine Routes (`/api/routines`)
- `GET /` → Get user's routine
- `POST /` → Add routine task
- `PUT /:id` → Update task
- `DELETE /:id` → Delete task

### Log Routes (`/api/logs`)
- `POST /complete` → Mark task complete for the day
- `GET /daily` → Get daily logs
- `GET /weekly` → Get weekly logs
- `GET /monthly` → Get monthly logs

### Special Task Routes (`/api/events`)
- `GET /` → Get events for date range
- `POST /` → Add new event
- `DELETE /:eventId` → Delete event

