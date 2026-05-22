const axios = require('axios');
const { tmdb } = require('../config/env');

// Axios instance with TMDB Bearer auth pre-configured
const tmdbClient = axios.create({
  baseURL: tmdb.baseUrl,
  headers: {
    Authorization: `Bearer ${tmdb.token}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const get = (path, params = {}) =>
  tmdbClient.get(path, { params }).then((res) => res.data);

module.exports = {
  getPopular: (page = 1) => get('/movie/popular', { page }),

  getTrending: (timeWindow = 'day') => get(`/trending/movie/${timeWindow}`),

  getTopRated: (page = 1) => get('/movie/top_rated', { page }),

  getNowPlaying: (page = 1) => get('/movie/now_playing', { page }),

  searchMovies: (query, page = 1) =>
    get('/search/movie', { query, page, include_adult: false }),

  getMovieDetail: (id) =>
    get(`/movie/${id}`, {
      append_to_response: 'credits,videos,similar,watch/providers',
    }),

  getUpcoming: (page = 1) => get('/movie/upcoming', { page }),

  getGenres: () => get('/genre/movie/list'),

  // Discover movies — filter by genre, country, sort
  discoverMovies: ({ genre_id, country, sort_by = 'popularity.desc', page = 1 } = {}) =>
    get('/discover/movie', {
      with_genres: genre_id || undefined,
      with_origin_country: country || undefined,
      sort_by,
      page,
      include_adult: false,
    }),

  // TV Series endpoints
  getTVPopular: (page = 1) => get('/tv/popular', { page }),
  getTVTrending: (timeWindow = 'week') => get(`/trending/tv/${timeWindow}`),
  getTVTopRated: (page = 1) => get('/tv/top_rated', { page }),
  getTVOnAir: (page = 1) => get('/tv/on_the_air', { page }),
  getTVDetail: (id) =>
    get(`/tv/${id}`, {
      append_to_response: 'credits,videos,similar,watch/providers',
    }),
  discoverTV: ({ genre_id, country, sort_by = 'popularity.desc', page = 1 } = {}) =>
    get('/discover/tv', {
      with_genres: genre_id || undefined,
      with_origin_country: country || undefined,
      sort_by,
      page,
      include_adult: false,
    }),
  getTVGenres: () => get('/genre/tv/list'),
};
