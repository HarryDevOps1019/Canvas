import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products/featured');
      const data = await response.json();
      
      if (data.success) {
        setFeaturedProducts(data.products);
      } else {
        setError(data.message || 'Failed to load featured products');
      }
    } catch (err) {
      setError('Failed to connect to the server');
      console.error('Error fetching featured products:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FiStar key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FiStar key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />);
      } else {
        stars.push(<FiStar key={i} className="w-4 h-4 md:w-5 md:h-5 text-gray-300" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <section className="w-full py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchFeaturedProducts}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="w-full py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600">No featured products available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 md:py-16 px-4 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg">
            Check out our handpicked selection of trending items
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden bg-gray-100 h-48 md:h-64">
                <img
                  src={product.imageUrl || `https://via.placeholder.com/300x400?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x400?text=${encodeURIComponent(product.name)}`;
                  }}
                />
                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition">
                  <FiHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                </button>
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link
                  to={`/product/${product._id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-2"
                >
                  {product.name}
                </Link>

                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 my-2">
                  <div className="flex">
                    {renderStars(product.rating || 4.5)}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.rating ? product.rating.toFixed(1) : '4.5'})
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {product.reviews || 0} reviews
                  </span>
                </div>

                {/* Sizes */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.sizes?.map((size) => (
                    <span
                      key={size}
                      className="px-2 py-1 text-xs border border-gray-300 rounded"
                    >
                      {size}
                    </span>
                  ))}
                </div>

                {/* Price and Button */}
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price?.toFixed(2) || '0.00'}
                    </span>
                    {product.stock && product.stock < 10 && (
                      <p className="text-xs text-red-600 mt-1">
                        Only {product.stock} left in stock!
                      </p>
                    )}
                  </div>
                  <button 
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    onClick={() => {
                      // Add to cart logic here
                      console.log('Add to cart:', product._id);
                    }}
                  >
                    <FiShoppingCart className="w-5 h-5" />
                    <span className="hidden sm:inline">Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}