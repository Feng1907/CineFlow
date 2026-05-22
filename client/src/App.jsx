import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Genre from './pages/Genre';
import Country from './pages/Country';
import NowPlaying from './pages/NowPlaying';
import TVShows from './pages/TVShows';
import Movies from './pages/Movies';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/movie/:id"     element={<MovieDetail />} />
            <Route path="/search"        element={<Search />} />
            <Route path="/favorites"     element={<Favorites />} />
            <Route path="/genre/:id"     element={<Genre />} />
            <Route path="/country/:code" element={<Country />} />
            <Route path="/now-playing"   element={<NowPlaying />} />
            <Route path="/tv"            element={<TVShows />} />
            <Route path="/movies"        element={<Movies />} />
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
