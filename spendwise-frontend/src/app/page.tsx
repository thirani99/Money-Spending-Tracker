export default function Home() {
  return (
    <div className="font-sans min-h-screen flex items-center justify-center p-2 bg-gray-50 bg-pink-200">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl gap-15">

        <div className="flex-1 flex justify-center">
          <img
            src="/cartoon_girl.webp" 
            alt="Money Tracker"
            className="w-150 h-auto rounded-2xl shadow-lg"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
            Stop Guessing. Start Saving. Track Your Money Effortlessly.
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Manage your finances smarter and reach your goals faster.
          </p>
        </div>
      </div>
    </div>
  );
}
