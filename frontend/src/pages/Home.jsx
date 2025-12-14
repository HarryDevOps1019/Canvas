import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow w-full">

        {/* Home */}
        <section id="home">
          <HeroBanner />
        </section>

        {/* Categories */}
        <section id="categories">
          <Categories />
        </section>

        {/* Products */}
        <section id="products">
          <FeaturedProducts />
        </section>

        {/* Features */}
        <section id="features">
          <Features />
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
