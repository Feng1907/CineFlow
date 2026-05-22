import { getPopular, getTopRated } from '../api/movieApi';
import { useState } from 'react';
import BrowsePage from '../components/BrowsePage';

const TABS = [
  { key: 'popular',   label: 'Phổ biến',     fetcher: (p, s) => getPopular(p)  },
  { key: 'top-rated', label: 'Đánh giá cao', fetcher: (p, s) => getTopRated(p) },
];

export default function Movies() {
  const [activeTab, setActiveTab] = useState('popular');
  const tab = TABS.find((t) => t.key === activeTab);

  return (
    <div>
      <div className="fixed top-16 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 py-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === t.key
                  ? 'bg-brand text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="pt-10">
        <BrowsePage
          subtitle="Phim lẻ"
          title={`🎬 ${tab.label}`}
          watchKey={activeTab}
          showSort={false}
          fetcher={tab.fetcher}
        />
      </div>
    </div>
  );
}
