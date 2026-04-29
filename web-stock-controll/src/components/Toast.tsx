import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      role="alert"
      className={`fixed top-4 right-4 z-50 flex items-start gap-3 rounded-lg border-l-4 px-4 py-3 shadow-lg max-w-sm w-full ${
        type === 'success'
          ? 'bg-green-50 border-green-500 text-green-800'
          : 'bg-red-50 border-red-500 text-red-800'
      }`}
    >
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="text-current opacity-50 hover:opacity-100 text-xl leading-none mt-[-2px]"
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  );
}
