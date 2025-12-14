import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <section className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Welcome to Canvas
            </h1>
            <p className="text-base md:text-lg text-blue-100">
              Discover the latest trends in fashion. Shop premium clothing for Men, Women, and Kids with exclusive collections and unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/products"
                className="px-6 md:px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition text-center"
              >
                Shop Now
              </Link>
              <Link
                to="/products"
                className="px-6 md:px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition text-center"
              >
                Explore Collections
              </Link>
            </div>
          </div>

          {/* Right Image Placeholder */}
          <div className="hidden md:flex justify-center">
            <div className="bg-blue-500 rounded-lg w-full max-w-sm h-80 flex items-center justify-center">
              <div className="text-center px-4">
                <svg className="w-24 h-24 md:w-32 md:h-32 mx-auto text-blue-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-blue-100 text-sm md:text-base">Fashion Collection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
