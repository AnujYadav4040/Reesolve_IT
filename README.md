# Resolve IT — Smart IT Helpdesk Ticketing System

> B.Tech Final Year Project | Dept. of Information Technology  
> Goel Institute of Technology & Management, Lucknow  
> Dr. A.P.J Abdul Kalam Technical University

---

## 👥 Team

| Name | Enrollment No. |
|------|----------------|
| Aman | 2303600130009 |
| Anuj Yadav | 2303600130017 |
| Sarvesh | 2303600130049 |
| Neeraj Gupta | 2303600130038 |

**Supervisor:** Abhishek Yadav (Assistant Professor, Dept. of IT)

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18 |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens) |
| Real-time | Socket.io |
| Charts | Chart.js + react-chartjs-2 |
| AI Feature | Keyword-based priority predictor |

---

## 📁 Project Structure

```
resolve-it/
├── backend/
│   ├── models/
│   │   ├── User.js           # User schema (user/admin/technician roles)
│   │   ├── Technician.js     # Technician profile + skill set
│   │   ├── Ticket.js         # Core ticket entity with AI priority field
│   │   ├── Feedback.js       # User feedback/rating per ticket
│   │   └── ActivityLog.js    # Audit trail for all ticket actions
│   ├── routes/
│   │   ├── authRoutes.js     # POST /login, /register, GET /me
│   │   ├── ticketRoutes.js   # Full ticket CRUD + assign + status update
│   │   ├── userRoutes.js     # User management (admin)
│   │   ├── technicianRoutes.js
│   │   ├── adminRoutes.js    # Dashboard stats + auto-assign
│   │   ├── feedbackRoutes.js
│   │   ├── activityRoutes.js
│   │   └── analyticsRoutes.js # Chart.js data endpoints
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protect + role-based authorize
│   ├── controllers/
│   │   └── aiPriorityController.js  # AI keyword scoring engine
│   ├── server.js             # Express app + Socket.io setup
│   ├── seeder.js             # Demo data seeder
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── context/
        │   └── AuthContext.js    # Global auth state (React Context)
        ├── components/
        │   └── Sidebar.js        # Role-aware navigation sidebar
        ├── pages/
        │   ├── LoginPage.js
        │   ├── RegisterPage.js
        │   ├── UserDashboard.js
        │   ├── CreateTicket.js   # With live AI priority preview
        │   ├── MyTickets.js      # Filtered ticket list + pagination
        │   ├── TicketDetail.js   # Real-time updates via Socket.io
        │   ├── TechnicianDashboard.js
        │   ├── AdminDashboard.js
        │   ├── AdminTickets.js   # Assign, auto-assign, priority override
        │   ├── AdminAnalytics.js # Chart.js: Doughnut, Bar, Line charts
        │   └── AdminTechnicians.js
        ├── api.js               # Axios API helper (all endpoints)
        ├── App.js               # React Router with role-based guards
        ├── index.css            # Full design system (dark theme)
        └── index.js
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### 1. Clone / unzip the project

```bash
cd resolve-it
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resolve_it
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
```

**Seed demo data (optional but recommended):**
```bash
node seeder.js
```

**Start the backend server:**
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start React dev server
npm start
```

App opens at: `http://localhost:3000`

---

## 🔑 Demo Login Credentials

After running `node seeder.js`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@resolveit.com | admin123 |
| Technician | rahul@resolveit.com | tech123 |
| Technician | priya@resolveit.com | tech123 |
| User | aman@resolveit.com | user123 |
| User | anuj@resolveit.com | user123 |

---

## 🔌 API Endpoints Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + get JWT |
| GET | `/api/auth/me` | Get current user |

### Tickets
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/tickets` | User |
| GET | `/api/tickets` | All (role-filtered) |
| GET | `/api/tickets/:id` | All |
| PUT | `/api/tickets/:id/status` | Technician, Admin |
| PUT | `/api/tickets/:id/assign` | Admin |
| PUT | `/api/tickets/:id/priority` | Admin |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Summary stats |
| POST | `/api/admin/auto-assign/:ticketId` | Auto-assign to best technician |

### Analytics
| Method | Endpoint |
|--------|----------|
| GET | `/api/analytics/tickets-by-status` |
| GET | `/api/analytics/tickets-by-category` |
| GET | `/api/analytics/tickets-by-priority` |
| GET | `/api/analytics/tickets-trend` |
| GET | `/api/analytics/technician-performance` |
| GET | `/api/analytics/avg-rating` |

---

## 🤖 AI Priority Prediction

The system uses a **keyword scoring engine** (`aiPriorityController.js`) that analyzes ticket title + description and assigns scores:

| Priority | Weight | Example Keywords |
|----------|--------|-----------------|
| Critical | +3 | server down, data loss, breach, emergency |
| High | +2 | not working, broken, error, urgent |
| Medium | +1 | slow, issue, configure, setup |
| Low | +1 | question, inquiry, minor, how to |

The highest-scoring category becomes the predicted priority. This runs both:
- **Backend:** When ticket is created (stored as `aiPredictedPriority`)
- **Frontend:** Live preview while user types the ticket description

---

## 🔄 Real-time Features (Socket.io)

| Event | Direction | Trigger |
|-------|-----------|---------|
| `new_ticket` | Server → All | Ticket created |
| `ticket_updated` | Server → Room | Status changed |
| `ticket_assigned` | Server → All | Technician assigned |
| `join_room` | Client → Server | User views ticket detail |

---

## 📊 Analytics Charts

| Chart | Type | Data |
|-------|------|------|
| Tickets by Status | Doughnut | open/in-progress/resolved/closed |
| Tickets by Priority | Doughnut | low/medium/high/critical |
| Tickets by Category | Bar | hardware/software/network/access |
| Monthly Trend | Line | Last 6 months ticket volume |

---

## 🧩 Modules Summary

### User Module
- Register / Login
- Create tickets with live AI priority preview
- Track ticket status in real time
- View activity timeline
- Submit feedback after resolution

### Technician Module
- View all assigned tickets
- Update status: In Progress → Resolved / On Hold
- Toggle availability status (Available / Busy / Offline)
- Enter resolution notes

### Admin Module
- System-wide dashboard with statistics
- Assign tickets manually or auto-assign (smart allocation)
- Override ticket priority
- View analytics (charts)
- Manage technician roster

---

## 🛡️ Security

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- **JWT** tokens with 7-day expiry
- Role-based route protection (`protect` + `authorize` middleware)
- CORS restricted to frontend origin

---

## 📦 Key Dependencies

### Backend
```json
"express": "^4.18.2",
"mongoose": "^7.2.0",
"jsonwebtoken": "^9.0.0",
"bcryptjs": "^2.4.3",
"socket.io": "^4.6.1",
"dotenv": "^16.0.3"
```

### Frontend
```json
"react": "^18.2.0",
"react-router-dom": "^6.11.2",
"axios": "^1.4.0",
"socket.io-client": "^4.6.1",
"chart.js": "^4.3.0",
"react-chartjs-2": "^5.2.0"
```

---

## 🚀 Future Enhancements

1. **Email Notifications** — Nodemailer integration for ticket updates
2. **File Attachments** — Multer + Cloudinary for screenshot uploads  
3. **Mobile App** — React Native companion app
4. **SLA Management** — Auto-escalation based on response time
5. **ML Priority Model** — Replace keyword engine with trained NLP model
6. **Two-Factor Auth** — OTP-based login security
7. **Dark/Light Theme Toggle** — User preference persistence
