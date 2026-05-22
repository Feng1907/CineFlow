import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { discoverMovies, getGenres } from '../api/movieApi';
import BrowsePage from '../components/BrowsePage';

export default function Genre() {
  const { id } = useParams();
  const [genreName, setGenreName] = useState('');

  useEffect(() => {
    getGenres()
      .then((data) => {
        const found = data.genres?.find((g) => String(g.id) === String(id));
        if (found) setGenreName(found.name);
      })
      .catch(() => {});
  }, [id]);

  return (
    <BrowsePage
      subtitle="Thể loại"
      title={genreName || '...'}
      watchKey={id}
      fetcher={(page, sort_by) => discoverMovies({ genre_id: id, sort_by, page })}
    />
  );
}
