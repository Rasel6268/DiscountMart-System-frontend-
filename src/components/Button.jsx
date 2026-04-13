'use client';

export default function Button({ children, loading, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
  };

  return (
    <button
      className={`
        w-full py-2 px-4 rounded-lg font-medium transition-colors
        ${variants[variant]}
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}