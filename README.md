# CineBook — Movie Ticket Booking & Review System

**CineBook** is a full-stack production-ready MERN (MongoDB, Express.js, React.js + Vite, Node.js) web application designed for online movie ticket booking and authentic audience reviews.

---

## 🌟 Key Features

### 👤 User Features
- **User Authentication**: Register, Login, JWT authentication, persistent session, and Profile page.
- **Movie Browsing**: Homepage with Hero Banner, Now Showing, and Top Rated movies.
- **Search & Filters**: Real-time live movie search, filter by Genre (Action, Sci-Fi, etc.), Language, and Minimum Star Rating.
- **Movie Details & YouTube Trailer**: Movie description, duration, release date, average rating, and embedded trailer.
- **Audience Reviews**: Post reviews, edit/delete own reviews, view community ratings. Automatic average rating recalculation.
- **Visual Seat Selection**: Interactive seat matrix (Screen layout, Available, Selected, Booked seats).
- **Seat Overbooking Protection**: Strict backend validation to prevent double-booking of seats.
- **Booking Reference & E-Ticket**: Generates unique booking reference code (`CB-2026-XXXXXX`) with print ticket functionality.
- **My Bookings & Cancellations**: Track booking history and cancel upcoming reservations to release seats.

### 🛡️ Admin Features
- **Admin Dashboard**: Real-time statistics (Total Movies, Theatres, Shows, Customers, Total Revenue, Reviews).
- **Movie Management (CRUD)**: Add, edit, delete movies with poster URLs & trailers.
- **Theatre Management (CRUD)**: Add, edit, delete multiplex locations and multi-screen configurations.
- **Show Scheduling**: Schedule shows with specific theatre screens, dates, timings, and ticket prices.
- **Booking Audit**: View all customer reservations and cancel if necessary.
- **User Management**: View registered user directory and role permissions.
- **Review Moderation**: View all audience reviews and delete inappropriate reviews.

---

## 🛠️ Technology Stack

- **Frontend**: React.js (v18), Vite, JavaScript, React Router DOM (v6), Axios, Tailwind CSS, Lucide React icons.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose ODM, JWT (`jsonwebtoken`), `bcryptjs` password hashing, `cors`, `dotenv`.
- **Database**: MongoDB (Local or MongoDB Atlas).

---

## 📁 Project Structure

```text
cinebook/
├── backend/
│   ├── config/          # Database configuration (db.js)
│   ├── controllers/     # API request handlers (auth, movie, theatre, show, booking, review, admin)
│   ├── middleware/      # Auth & error handling middlewares
│   ├── models/          # Mongoose schemas (User, Movie, Theatre, Show, Booking, Review)
│   ├── routes/          # Express route definitions
│   ├── utils/           # Booking reference generator & rating recalculation logic
│   ├── seeders/         # Seed script for initial database setup
│   ├── .env             # Backend environment variables
│   ├── server.js        # Main Express server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Footer, MovieCard, SeatGrid, BookingSummary, TicketCard, etc.
│   │   ├── context/     # AuthContext for user state & JWT tokens
│   │   ├── pages/       # Home, Movies, Details, Booking, Ticket, My Bookings, Profile, Admin Pages
│   │   ├── services/    # Axios client instance with Bearer token interceptor
│   │   ├── App.jsx      # React Router routes setup
│   │   └── main.jsx
│   ├── .env             # Frontend environment variables
│   └── package.json
│
└── README.md
```

---

## 🔑 Demo Account Credentials

After seeding the database, use these demo accounts to log in:

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@cinebook.com` | `Admin@123` | `admin` |
| **Demo User** | `user@cinebook.com` | `User@123` | `user` |

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18+ or v24 installed
- **MongoDB**: Local MongoDB service running at `mongodb://localhost:27017` or MongoDB Atlas URI.

---

### 2. Backend Setup & Database Seeding

Open terminal in the `backend` folder:

```bash
cd backend
npm install
```

Ensure `.env` contains:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cinebook
JWT_SECRET=cinebook_super_secret_jwt_key_2026_dev
CLIENT_URL=http://localhost:5173
```

Seed initial database (Admin, movies, theatres, shows, reviews):
```bash
npm run seed
```

Start the backend dev server:
```bash
npm run dev
```
*Backend API will run at `http://localhost:5000`.*

---

### 3. Frontend Setup

Open a new terminal in the `frontend` folder:

```bash
cd frontend
npm install
```

Ensure `.env` contains:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
```
*Frontend application will run at `http://localhost:5173`.*

---

## 📡 API Endpoints Overview

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login user & return JWT token
- `GET  /api/auth/me` — Get current logged-in user profile

### Movies
- `GET    /api/movies` — List movies (supports `search`, `genre`, `language`, `rating` filters)
- `GET    /api/movies/:id` — Get single movie details
- `POST   /api/movies` — Create movie *(Admin only)*
- `PUT    /api/movies/:id` — Update movie *(Admin only)*
- `DELETE /api/movies/:id` — Delete movie *(Admin only)*

### Theatres
- `GET    /api/theatres` — List all theatres
- `POST   /api/theatres` — Create theatre *(Admin only)*
- `PUT    /api/theatres/:id` — Update theatre *(Admin only)*
- `DELETE /api/theatres/:id` — Delete theatre *(Admin only)*

### Shows & Seat Availability
- `GET    /api/shows` — List shows (filtered by `movie`, `theatre`, `date`)
- `GET    /api/shows/:id` — Get show details
- `GET    /api/shows/:id/seats` — Get seat availability status matrix
- `POST   /api/shows` — Schedule show *(Admin only)*
- `DELETE /api/shows/:id` — Delete show *(Admin only)*

### Bookings
- `POST   /api/bookings` — Book tickets (with double-booking check)
- `GET    /api/bookings/my` — Get user booking history
- `GET    /api/bookings/:id` — Get booking ticket details
- `PUT    /api/bookings/:id/cancel` — Cancel booking & release seats
- `GET    /api/bookings` — View all bookings *(Admin only)*

### Reviews & Ratings
- `GET    /api/movies/:movieId/reviews` — Fetch movie reviews
- `POST   /api/movies/:movieId/reviews` — Add review (recalculates movie rating)
- `PUT    /api/reviews/:id` — Edit own review
- `DELETE /api/reviews/:id` — Delete review (recalculates movie rating)

### Admin Management
- `GET /api/admin/dashboard-stats` — Get dashboard metrics & revenue
- `GET /api/admin/users` — List registered users
- `GET /api/admin/reviews` — View all reviews for moderation

---

## 🧪 Verification Checklist

- [x] Backend connects to MongoDB cleanly
- [x] User registration & JWT authentication verified
- [x] Admin protection middleware blocks non-admin users
- [x] Double-seat booking prevention verified on backend
- [x] Ratings auto-recalculate upon review creation/deletion
- [x] Print ticket formatting verified
- [x] Database seeder populates demo admin and user credentials
