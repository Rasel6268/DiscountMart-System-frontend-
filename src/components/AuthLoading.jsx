const AuthLoading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      
      {/* Spinner */}
      <div className="relative">
        <div className="h-14 w-14 rounded-full border-4 border-gray-200"></div>
        <div className="h-14 w-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>

      {/* Text */}
      <p className="mt-4 text-sm font-medium text-gray-600">
        Checking authorization...
      </p>
    </div>
  );
};

export default AuthLoading;