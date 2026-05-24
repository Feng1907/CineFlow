# 🎬 CineFlow

A modern movie & TV discovery web app built with React + Vite (frontend) and Node.js + Express (backend), powered by the [TMDB API](https://www.themoviedb.org/).

> **Note:** CineFlow does **not** stream, host, or provide any full movie or TV files. It only displays metadata, posters, trailers (via YouTube), and embeds third-party players sourced externally.

---

## ✨ Features

- 🔥 Trending movies & TV shows (daily / weekly)
- 🎬 Now Playing, Upcoming, Popular, Top Rated — for both movies and TV
- 🔍 Multi-type search — movies and TV shows in a single query
- 📄 Detailed movie & TV pages — poster, backdrop, overview, cast, genres, runtime, rating, seasons
- 🎥 YouTube trailer modal
- 📺 Multi-server video player — 8 embedded servers with dropdown selector (default: Embed.su)
- 🛡️ Toggleable ad blocker in the video player
- 🔄 Continue Watching — resumes playback history per user
- ❤️ Favorites & Watchlist — synced to your account (MongoDB)
- 👤 User auth — register, login, JWT access + refresh tokens, profile & password management
- 🎭 Browse by genre, country, and person detail pages
- ⚡ Loading skeletons, error states, and toast notifications
- 📱 Fully responsive — mobile, tablet, desktop

---

## 🛠 Tech Stack

| Layer    | Technology                                                                    |
| -------- | ----------------------------------------------------------------------------- |
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide React            |
| Backend  | Node.js, Express, Mongoose, JWT (access + refresh), Helmet, CORS, rate-limit |
| Database | MongoDB                                                                       |
| Data     | TMDB API v3 (Bearer Token)                                                    |

---

## 🔑 Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- TMDB Read Access Token — get one free at [themoviedb.org](https://www.themoviedb.org/) → Settings → API

---

## 🚀 Installation & Running

### 1. Clone the repo

```bash
git clone <repo-url>
cd MovieHub
```

### 2. Set up the backend

```bash
cd server
cp .env.example .env
# Fill in: TMDB_READ_ACCESS_TOKEN, MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET
npm install
npm run dev      # runs on http://localhost:5000
```

### 3. Set up the frontend

```bash
cd ../client
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api (already set)
npm install
npm run dev      # runs on http://localhost:5173
```

### 4. Open the app

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```text
MovieHub/
├── client/                   # React + Vite frontend
│   ├── public/               # Static assets & placeholder SVGs
│   └── src/
│       ├── api/              # Axios API calls to backend
│       ├── components/       # Reusable UI components
│       ├── hooks/            # Custom hooks (auth, favorites, watchlist…)
│       ├── pages/            # Page-level components
│       └── utils/            # Image URL helpers, formatters
│
└── server/                   # Express backend
    └── src/
        ├── config/           # env.js — validates & exports env vars
        ├── controllers/      # Route handlers (auth, user, movie, tv)
        ├── middlewares/      # JWT auth, error handler
        ├── models/           # Mongoose models (User)
        ├── routes/           # Express route definitions
        └── services/         # TMDB API service layer
```

---

## 🌐 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint    | Description                              |
| ------ | ----------- | ---------------------------------------- |
| POST   | `/register` | Create account                           |
| POST   | `/login`    | Login, receive access + refresh tokens   |
| POST   | `/refresh`  | Refresh access token                     |
| POST   | `/logout`   | Invalidate refresh token (auth required) |
| GET    | `/me`       | Get current user (auth required)         |

### User — `/api/user` *(all require auth)*

| Method                  | Endpoint                              | Description                      |
| ----------------------- | ------------------------------------- | -------------------------------- |
| GET / POST / DELETE     | `/favorites` / `/favorites/:id`       | Manage favorites                 |
| GET / POST / DELETE     | `/watchlist` / `/watchlist/:id`       | Manage watchlist                 |
| GET / POST / DELETE     | `/history`                            | View / add / clear watch history |
| PATCH                   | `/profile`                            | Update display name / avatar     |
| PATCH                   | `/password`                           | Change password                  |

### Content — `/api`

| Method | Endpoint                           | Description                             |
| ------ | ---------------------------------- | --------------------------------------- |
| GET    | `/movies/popular`                  | Popular movies (`?page`)                |
| GET    | `/movies/trending`                 | Trending (`?timeWindow=day\|week`)      |
| GET    | `/movies/top-rated`                | Top rated movies                        |
| GET    | `/movies/now-playing`              | Currently in theaters                   |
| GET    | `/movies/upcoming`                 | Upcoming releases                       |
| GET    | `/movies/search`                   | Search movies (`?query=&page=`)         |
| GET    | `/movies/discover`                 | Discover with filters                   |
| GET    | `/movies/:id`                      | Movie detail (credits, videos, similar) |
| GET    | `/tv/popular`                      | Popular TV shows                        |
| GET    | `/tv/trending`                     | Trending TV (`?timeWindow=day\|week`)   |
| GET    | `/tv/top-rated`                    | Top rated TV                            |
| GET    | `/tv/on-air`                       | Currently airing                        |
| GET    | `/tv/discover`                     | Discover TV with filters                |
| GET    | `/tv/:id`                          | TV detail                               |
| GET    | `/tv/:id/season/:seasonNumber`     | Season detail & episodes                |
| GET    | `/people/:id`                      | Person detail                           |
| GET    | `/genres/movie`                    | Movie genre list                        |
| GET    | `/genres/tv`                       | TV genre list                           |
| GET    | `/health`                          | Server health check                     |

---

## ⚠️ Legal Notice

This product uses the TMDB API but is not endorsed or certified by TMDB.

No movies, TV shows, or any copyrighted media are hosted or streamed by CineFlow.
