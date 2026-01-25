import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/home/HeroSection";
import CategoriesSection from "./components/home/CategoriesSection";
import PopularCoursesSection from "./components/home/PopularCoursesSection";
import WhyChooseSection from "./components/home/WhyChooseSection";
import TestimonialsSection from "./components/home/TestimonialsSection";
import CTASection from "./components/home/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Header />
      <HeroSection />
      <CategoriesSection />
      <PopularCoursesSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
