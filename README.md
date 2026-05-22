# 🎬 CineFlow

A modern movie discovery web app built with React + Vite (frontend) and Node.js + Express (backend), powered by the [TMDB API](https://www.themoviedb.org/).

> **Note:** CineFlow does **not** stream, host, or provide any full movie files. It only displays movie information, posters, backdrops, trailers (via YouTube), and metadata sourced from the TMDB API.

---

## ✨ Features

- 🔥 Trending movies (daily / weekly)
- 🎬 Now Playing in theaters
- 🌟 Popular & Top Rated movies
- 🔍 Real-time movie search with debounce
- 📄 Detailed movie page — poster, backdrop, overview, cast, genres, runtime, rating
- 🎥 Watch YouTube trailers in a modal
- ❤️ Add/remove favorites (stored in localStorage)
- 📺 Watch provider info (US region, powered by JustWatch via TMDB)
- 📱 Fully responsive — mobile, tablet, desktop
- ⚡ Loading skeletons & error states

---

## 🛠 Tech Stack

| Layer    | Technology                                              |
|----------|---------------------------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios, Lucide React |
| Backend  | Node.js, Express, Axios, Helmet, CORS, express-rate-limit |
| Data     | TMDB API v3 (Bearer Token)                              |
| Storage  | localStorage (favorites)                                |

---

## 🔑 Getting Your TMDB API Token

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/)
2. Go to **Settings → API** and request an API key
3. Copy your **Read Access Token (v4 auth)** — it starts with `eyJ...`

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
# Edit .env and paste your TMDB_READ_ACCESS_TOKEN
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

```
MovieHub/
├── client/                   # React + Vite frontend
│   ├── public/               # Static assets & placeholder SVGs
│   └── src/
│       ├── api/              # Axios API calls to backend
│       ├── components/       # Reusable UI components
│       ├── hooks/            # useFavorites (localStorage)
│       ├── pages/            # Page-level components
│       └── utils/            # Image URL helpers, formatters
│
└── server/                   # Express backend
    └── src/
        ├── config/           # env.js — validates & exports env vars
        ├── controllers/      # Route handlers
        ├── middlewares/      # Error handler
        ├── routes/           # Express route definitions
        └── services/         # tmdbService.js — TMDB API calls
```

---

## 🌐 API Endpoints

| Method | Endpoint                  | Description                          |
|--------|---------------------------|--------------------------------------|
| GET    | `/api/movies/popular`     | Popular movies (`?page`)             |
| GET    | `/api/movies/trending`    | Trending movies (`?timeWindow=day|week`) |
| GET    | `/api/movies/top-rated`   | Top rated movies                     |
| GET    | `/api/movies/now-playing` | Currently in theaters                |
| GET    | `/api/movies/search`      | Search (`?query=&page=`)             |
| GET    | `/api/movies/:id`         | Movie detail with credits, videos, similar |
| GET    | `/api/genres/movie`       | Genre list                           |
| GET    | `/health`                 | Server health check                  |

---

## ⚠️ Legal Notice

This product uses the TMDB API but is not endorsed or certified by TMDB.

No movies, TV shows, or any copyrighted media are hosted or streamed by CineFlow.
