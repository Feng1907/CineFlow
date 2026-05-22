import { getNowPlaying } from '../api/movieApi';
import BrowsePage from '../components/BrowsePage';

export default function NowPlaying() {
  return (
    <BrowsePage
      subtitle="Đang chiếu"
      title="🎬 Phim Chiếu Rạp"
      watchKey="now-playing"
      showSort={false}
      fetcher={(page) => getNowPlaying(page)}
    />
  );
}
