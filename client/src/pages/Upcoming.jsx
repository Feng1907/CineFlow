import { getUpcoming } from '../api/movieApi';
import BrowsePage from '../components/BrowsePage';

export default function Upcoming() {
  return (
    <BrowsePage
      subtitle="Sắp ra mắt"
      title="🎟️ Phim Sắp Chiếu"
      watchKey="upcoming"
      showSort={false}
      fetcher={(page) => getUpcoming(page)}
    />
  );
}
