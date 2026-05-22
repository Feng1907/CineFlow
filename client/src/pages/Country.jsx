import { useParams } from 'react-router-dom';
import { discoverMovies } from '../api/movieApi';
import { COUNTRIES } from '../utils/constants';
import BrowsePage from '../components/BrowsePage';

export default function Country() {
  const { code } = useParams();
  const country = COUNTRIES.find((c) => c.code === code);

  return (
    <BrowsePage
      subtitle="Quốc gia"
      title={country?.name || code}
      watchKey={code}
      fetcher={(page, sort_by) => discoverMovies({ country: code, sort_by, page })}
    />
  );
}
