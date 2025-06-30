<h1 align="center">🩺 MediTrack – Full Stack Medical Appointment & Prescription System</h1>

<p align="center">
  <b>A role-based medical platform for Doctors and Patients built using MERN stack</b><br/>
  <i>Appointments • Prescriptions • Secure Auth • Real-time Management</i>
</p>

---

## ✨ Features

### 🧑‍⚕️ Doctor Features
- ✅ View, accept, complete, and reject patient appointments
- 💊 Add prescriptions after consultations
- 📋 View patient feedback (optional or upcoming)
- 📊 Personalized role-based dashboard

### 👨‍⚕️ Patient Features
- 📝 Register and log in with validation
- 📅 Book up to 2 appointments per day
- 🔎 View appointment history and prescription details
- ⭐ Give feedback after consultations(upcomming feature)

---

## 🔐 Authentication & Security
- 🔑 JWT-based secure login system
- 🧱 Role-based protected routes with middleware
- 🔒 Passwords encrypted using bcrypt
- 🚫 Patients can’t access doctor routes (and vice versa)

---

## 🛠️ Tech Stack

| Frontend     | Backend       | Database   | Tools & Auth              |
|--------------|----------------|------------|---------------------------|
| ⚛️ React.js | 🚀 Express.js | 🍃 MongoDB | JWT 🔐, Bcrypt 🔑, Axios 🌐 |

---

## 📁 Folder Structure

```bash
MediTrack/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── routes/
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   └── App.jsx
└── README.md

---

## 🚀 Getting Started (Local Setup)

### 🔧 Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

---

### 📦 Backend Setup

```bash
cd backend
npm install
```

🔐 **Create a `.env` file:**

```ini
PORT=5000
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_super_secret_key
```

▶️ **Start the backend server:**

```bash
npm install
npm run dev
```

---

### 💻 Frontend Setup

```bash
npx create-react-app Your-App-Name
cd frontend
npm install
npm start
```

Frontend will run on:  
👉 http://localhost:3000

> Ensure proxy or CORS is handled for connecting backend & frontend.

---

## 🌐 Deployment Guide

### 🔹 Deploy Backend on Render

1. Go to https://render.com  
2. Click **New Web Service**  
3. Connect your GitHub repo or paste the backend code manually  
4. Set environment variables:

```env
PORT=5000
MONGODB_URI=<your MongoDB Atlas URI>
JWT_SECRET=<your secret key>
```

5. Build Command: `npm install`  
6. Start Command: `npm run dev` or `node index.js`  
7. Wait for the Render URL (e.g., `https://meditrack-api.onrender.com`)

---

### 🔸 Deploy Frontend on Vercel

1. Go to https://vercel.com  
2. Connect GitHub repo or import frontend folder manually  
3. Set Project Settings:

```
Framework: React / Vite
Output directory: dist
```

4. Add `.env` file or Vite env variables:

```env
VITE_API_BASE_URL=https://meditrack-api.onrender.com
```

5. Deploy. You'll get a frontend URL like:  
👉 https://meditrack.vercel.app

---

## 🧪 Sample .env Files

### Backend `.env`

```ini
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/meditrack
JWT_SECRET=super_secure_key
```

### Frontend `.env` (`frontend/.env`)

```env
VITE_API_BASE_URL=https://meditrack-api.onrender.com
```

---

## 📸 UI Screenshots (Optional - Add your images)

<details>
<summary>📷 Click to expand UI Previews</summary>

<!-- Add image links below -->
<!-- ![Doctor Dashboard](assets/doctor_dashboard.png) -->

</details>

---

## 🙌 Contributions

Contributions, issues, and feature requests are welcome!  
Feel free to fork or raise PRs 💡

---

### ✅ Tips:
- Replace `your_mongo_connection_string`, `your_super_secret_key`, and `yourwebsite.com` with actual values.
- Keep `.env` files secure — do not commit them publicly.

---
