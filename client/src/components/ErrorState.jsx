import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message = 'Đã có lỗi xảy ra.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <AlertTriangle className="text-brand" size={48} />
      <div>
        <p className="text-lg font-semibold text-white">Oops! Đã có lỗi xảy ra</p>
        <p className="text-zinc-400 text-sm mt-1 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary mt-2"
        >
          <RefreshCw size={16} /> Thử lại
        </button>
      )}
    </div>
  );
}
