import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import TVDetail from './pages/TVDetail';
import PersonDetail from './pages/PersonDetail';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Genre from './pages/Genre';
import Country from './pages/Country';
import NowPlaying from './pages/NowPlaying';
import TVShows from './pages/TVShows';
import Movies from './pages/Movies';
import Upcoming from './pages/Upcoming';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"              element={<Home />} />
              <Route path="/movie/:id"     element={<MovieDetail />} />
              <Route path="/tv/:id"        element={<TVDetail />} />
              <Route path="/person/:id"    element={<PersonDetail />} />
              <Route path="/search"        element={<Search />} />
              <Route path="/favorites"     element={<Favorites />} />
              <Route path="/genre/:id"     element={<Genre />} />
              <Route path="/country/:code" element={<Country />} />
              <Route path="/now-playing"   element={<NowPlaying />} />
              <Route path="/tv"            element={<TVShows />} />
              <Route path="/movies"        element={<Movies />} />
              <Route path="/upcoming"      element={<Upcoming />} />
              <Route path="/login"         element={<Login />} />
              <Route path="/register"      element={<Register />} />
              <Route path="*"              element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
