export default function Loading({ message = "Loading..." }) {
  return (
    <div className="min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-7rem)] flex flex-col justify-center items-center gap-4">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      
      {/* Dynamic message */}
      <p className="text-gray-600 animate-pulse">{message}</p>
    </div>
  );
}