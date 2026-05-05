# Resolve IT — Smart IT Helpdesk Ticketing System

> B.Tech Final Year Project | Dept. of Information Technology  
> Goel Institute of Technology & Management, Lucknow  
> Dr. A.P.J Abdul Kalam Technical University

---

## 👥 Team

**Supervisor:** Abhishek Yadav (Assistant Professor, Dept. of IT)

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js 18, Framer Motion (Animations) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (JSON Web Tokens) |
| **Real-time** | Socket.io |
| **UI Design** | Vanilla CSS (Glassmorphism, Dark Theme, Light Mode Toggle) |
| **Charts** | Chart.js + react-chartjs-2 |
| **AI/ML Engine** | `natural` (NLP library), Keyword-based AI predictor |

---

## ✨ Key Features & Enhancements

1. **AI Chatbot & Smart FAQ**: Provides users with instant resolution suggestions and troubleshooting steps before they submit a ticket.
2. **Sentiment Analysis**: Evaluates the user's input to automatically adjust ticket priority based on frustration or urgency levels.
3. **Advanced ML Categorization**: Auto-categorizes tickets and assigns them to the most suitable technician based on skill sets.
4. **Real-time Updates**: Powered by Socket.io, users and technicians see live status changes, new ticket alerts, and instant dashboard syncs.
5. **Modern UI Aesthetics**: Premium, dark-themed glassmorphic design featuring seamless transitions and Framer Motion micro-animations. Includes an automatic light mode toggle for text colors.
6. **Role-Based Architecture**: Distinct interfaces and permissions for Users, Technicians, and Admins.

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
│   │   └── aiPriorityController.js  # AI NLP/Keyword scoring engine
│   ├── server.js             # Express app + Socket.io setup
│   ├── seeder.js             # Demo data seeder
│   ├── .env                  # Environment Variables + Pre-configured Users
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
        │   ├── LoginPage.js      # Premium Glassmorphic Login
        │   ├── RegisterPage.js
        │   ├── UserDashboard.js
        │   ├── CreateTicket.js   # With live AI priority preview & Chatbot
        │   ├── MyTickets.js      # Filtered ticket list + pagination
        │   ├── TicketDetail.js   # Real-time updates via Socket.io
        │   ├── TechnicianDashboard.js
        │   ├── AdminDashboard.js
        │   ├── AdminTickets.js   # Assign, auto-assign, priority override
        │   ├── AdminAnalytics.js # Chart.js: Doughnut, Bar, Line charts
        │   └── AdminTechnicians.js
        ├── api.js               # Axios API helper (all endpoints)
        ├── App.js               # React Router with role-based guards
        ├── index.css            # Full design system (dark/light theme)
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

# Create environment file (if missing, refer to .env section below)
cp .env.example .env
```

**Ensure your `.env` contains the default port and credentials:**
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/resolve_it
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

**Start the backend server:**
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5001`

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

The system includes pre-configured accounts in the `.env` file:

| Role | Name | Email | Password |
|------|------|-------|----------|
| **Admin** | Admin | `admin@resolveit.com` | `ResolveIt12@` |
| **Technician** | Sarvesh | `sarvesh@resolveit.com` | `Sarvesh123!` |
| **Technician** | Neeraj | `neeraj@resolveit.com` | `Neeraj123!` |
| **Technician** | Vinayak | `vinayak@resolveit.com` | `Vinayak123!` |
| **User** | Aman | `aman@resolveit.com` | `Aman123!` |
| **User** | Aditya | `aditya@resolveit.com` | `Aditya123!` |
| **User** | Ajay | `ajay@resolveit.com` | `Ajay123!` |

---

## 🤖 Smart AI Engine

The system uses an advanced backend logic incorporating **NLP and Sentiment Analysis** via the `natural` library (`aiPriorityController.js`) to score tickets.

### Evaluation Criteria:
1. **Keyword Analysis**: Checks for critical vs. minor terms (e.g., "server down" vs. "how to").
2. **Sentiment Weighting**: Frustrated or urgent language inherently scales up the ticket priority automatically.
3. **Smart Categorization**: ML logic routes the ticket context to the most capable technician available.

**Execution:**
- **Backend:** When a ticket is created, the NLP model generates `aiPredictedPriority`.
- **Frontend:** Instant feedback is given via the **Smart FAQ / Chatbot** while the user types, suggesting fixes before the ticket is finalized.

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

## 🛡️ Security

- Passwords hashed with **bcryptjs** (salt rounds: 10).
- **JWT** tokens with 7-day expiry.
- Role-based route protection (`protect` + `authorize` middleware).
- CORS restricted to frontend origin.

---

## 📦 Key Dependencies

### Backend
```json
"express": "^4.18.2",
"mongoose": "^7.2.0",
"jsonwebtoken": "^9.0.0",
"bcryptjs": "^2.4.3",
"socket.io": "^4.6.1",
"natural": "^8.1.1",
"dotenv": "^16.0.3"
```

### Frontend
```json
"react": "^18.2.0",
"react-router-dom": "^6.11.2",
"axios": "^1.4.0",
"framer-motion": "^12.38.0",
"socket.io-client": "^4.6.1",
"chart.js": "^4.3.0",
"react-chartjs-2": "^5.2.0"
```

---

## 🚀 Future Enhancements

1. **Email Notifications** — Nodemailer integration for ticket updates.
2. **File Attachments** — Multer + Cloudinary for screenshot uploads.
3. **Mobile App** — React Native companion app.
4. **SLA Management** — Auto-escalation based on response time.
5. **Two-Factor Auth** — OTP-based login security.
