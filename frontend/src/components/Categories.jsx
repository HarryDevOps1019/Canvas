import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function Categories() {
  const categories = [
    {
      id: 1,
      name: "Men's Collection",
      slug: 'Men',
      description: 'Explore our premium collection for men',
      icon: '👔',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      name: "Women's Collection",
      slug: 'Women',
      description: 'Discover stylish outfits for women',
      icon: '👗',
      color: 'from-pink-500 to-pink-600',
    },
    {
      id: 3,
      name: "Kids' Collection",
      slug: 'Kids',
      description: 'Fun and comfortable clothing for kids',
      icon: '👕',
      color: 'from-green-500 to-green-600',
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg">
            Browse our exclusive collections for every member of the family
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className={`bg-gradient-to-br ${category.color} rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition transform hover:scale-105 group`}
            >
              <div className="p-6 md:p-8 text-white h-56 md:h-64 flex flex-col justify-between">
                {/* Icon and Title */}
                <div>
                  <div className="text-4xl md:text-5xl mb-3 md:mb-4">{category.icon}</div>
                  <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">{category.name}</h3>
                  <p className="text-white text-opacity-90 text-xs md:text-sm">{category.description}</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-2 group-hover:gap-3 transition">
                  <span className="font-semibold text-sm md:text-base">Shop Now</span>
                  <FiArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
