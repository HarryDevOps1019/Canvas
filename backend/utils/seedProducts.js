const mongoose = require('mongoose');
const Product = require('../models/Product');

require('dotenv').config();

const products = [
  // Men's Clothing (7 products)
  {
    name: "Classic Cotton T-Shirt",
    description: "100% cotton crew neck t-shirt, perfect for everyday wear.",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 50,
    rating: 4.5,
    reviews: 120,
  },
  {
    name: "Denim Jacket",
    description: "Classic blue denim jacket with button front closure.",
    price: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    category: "Men",
    sizes: ["M", "L", "XL"],
    stock: 30,
    rating: 4.7,
    reviews: 85,
  },
  {
    name: "Chino Pants",
    description: "Comfortable chino pants perfect for casual and semi-formal occasions.",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 40,
    rating: 4.6,
    reviews: 95,
  },
  {
    name: "Hooded Sweatshirt",
    description: "Warm and comfortable hoodie with front pocket.",
    price: 44.99,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 35,
    rating: 4.8,
    reviews: 110,
  },
  {
    name: "Formal Dress Shirt",
    description: "Premium cotton dress shirt for formal occasions.",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 25,
    rating: 4.4,
    reviews: 60,
  },
  {
    name: "Cargo Shorts",
    description: "Comfortable cargo shorts with multiple pockets.",
    price: 29.99,
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1",
    category: "Men",
    sizes: ["S", "M", "L"],
    stock: 45,
    rating: 4.3,
    reviews: 75,
  },
  {
    name: "Leather Belt",
    description: "Genuine leather belt with classic buckle.",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 60,
    rating: 4.6,
    reviews: 140,
  },

  // Women's Clothing (7 products)
  {
    name: "Floral Summer Dress",
    description: "Light and breezy floral print dress for summer.",
    price: 49.99,
    imageUrl: "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43",
    category: "Women",
    sizes: ["S", "M", "L"],
    stock: 30,
    rating: 4.7,
    reviews: 105,
  },
  {
    name: "High-Waist Jeans",
    description: "Stylish high-waist jeans with stretch fabric.",
    price: 54.99,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 35,
    rating: 4.8,
    reviews: 130,
  },
  {
    name: "Knit Sweater",
    description: "Soft knit sweater perfect for cooler weather.",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
    category: "Women",
    sizes: ["S", "M", "L"],
    stock: 40,
    rating: 4.5,
    reviews: 90,
  },
  {
    name: "Elegance Blouse",
    description: "Silk blend blouse with delicate details.",
    price: 42.99,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
    category: "Women",
    sizes: ["S", "M", "L"],
    stock: 25,
    rating: 4.6,
    reviews: 70,
  },
  {
    name: "Active Leggings",
    description: "High-performance leggings for workouts and casual wear.",
    price: 32.99,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 50,
    rating: 4.7,
    reviews: 115,
  },
  {
    name: "Cardigan Wrap",
    description: "Cozy cardigan wrap for layering.",
    price: 47.99,
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
    category: "Women",
    sizes: ["S", "M", "L"],
    stock: 30,
    rating: 4.4,
    reviews: 65,
  },
  {
    name: "Maxi Skirt",
    description: "Flowery maxi skirt with comfortable elastic waist.",
    price: 37.99,
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1",
    category: "Women",
    sizes: ["S", "M", "L"],
    stock: 35,
    rating: 4.5,
    reviews: 80,
  },

  // Kids' Clothing (6 products)
  {
    name: "Kids Graphic Tee",
    description: "Fun graphic t-shirt for kids with cartoon prints.",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5",
    category: "Kids",
    sizes: ["S", "M", "L"],
    stock: 60,
    rating: 4.6,
    reviews: 95,
  },
  {
    name: "Children's Hoodie",
    description: "Warm and comfortable hoodie for children.",
    price: 29.99,
    imageUrl: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d",
    category: "Kids",
    sizes: ["S", "M", "L"],
    stock: 45,
    rating: 4.7,
    reviews: 100,
  },
  {
    name: "Kids Denim Jeans",
    description: "Durable denim jeans for active kids.",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985",
    category: "Kids",
    sizes: ["S", "M", "L"],
    stock: 40,
    rating: 4.5,
    reviews: 75,
  },
  {
    name: "Children's Pajama Set",
    description: "Soft and comfortable pajama set for kids.",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531",
    category: "Kids",
    sizes: ["S", "M", "L"],
    stock: 55,
    rating: 4.8,
    reviews: 120,
  },
  {
    name: "Kids Winter Jacket",
    description: "Warm winter jacket with water-resistant material.",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
    category: "Kids",
    sizes: ["S", "M", "L"],
    stock: 30,
    rating: 4.6,
    reviews: 85,
  },
  {
    name: "Children's Shorts",
    description: "Comfortable cotton shorts for playtime.",
    price: 16.99,
    imageUrl: "https://images.unsplash.com/photo-1584735174914-6b1272458e3e",
    category: "Kids",
    sizes: ["S", "M", "L"],
    stock: 65,
    rating: 4.4,
    reviews: 70,
  },

  // Additional Products
  {
    name: "Polo Shirt",
    description: "Classic polo shirt with embroidered logo.",
    price: 27.99,
    imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 40,
    rating: 4.5,
    reviews: 88,
  },
  {
    name: "Summer Skirt",
    description: "Light and airy skirt perfect for summer days.",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1565383671287-16e5d14a35e1",
    category: "Women",
    sizes: ["S", "M", "L"],
    stock: 30,
    rating: 4.6,
    reviews: 92,
  },
  {
    name: "Baby Romper",
    description: "Adorable romper for babies with snap buttons.",
    price: 18.99,
    imageUrl: "https://images.unsplash.com/photo-1586365474416-48a9985e8297",
    category: "Kids",
    sizes: ["S", "M"],
    stock: 50,
    rating: 4.7,
    reviews: 110,
  },
  {
    name: "Casual Blazer",
    description: "Lightweight blazer for smart casual looks.",
    price: 69.99,
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
    category: "Men",
    sizes: ["M", "L", "XL"],
    stock: 20,
    rating: 4.8,
    reviews: 125,
  },
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedProducts();
}

module.exports = seedProducts;
