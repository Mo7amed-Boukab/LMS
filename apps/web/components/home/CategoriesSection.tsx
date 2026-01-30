"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { courseApi } from "../../lib/services/courseService";
import CategoryCard from "./CategoryCard";

const PREDEFINED_CATEGORIES = [
  {
    title: "Development",
    icon: "code",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    title: "Business",
    icon: "work",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
  },
  {
    title: "Design",
    icon: "palette",
    bgColor: "bg-pink-50",
    textColor: "text-pink-700",
  },
  {
    title: "Marketing",
    icon: "campaign",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
  },
  {
    title: "Data Science",
    icon: "bar_chart",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
  },
  {
    title: "Finance",
    icon: "payments",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
  {
    title: "Photography",
    icon: "camera_alt",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-700",
  },
  {
    title: "Music",
    icon: "music_note",
    bgColor: "bg-rose-50",
    textColor: "text-rose-700",
  },
  {
    title: "Personal Development",
    icon: "self_improvement",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
  },
  {
    title: "Health & Fitness",
    icon: "fitness_center",
    bgColor: "bg-teal-50",
    textColor: "text-teal-700",
  },
];

export default function CategoriesSection() {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await courseApi.getCategories();
        // Convert array [{category: 'Design', count: 5}] to object {'Design': 5}
        const countsMap = data.reduce((acc, curr) => {
          acc[curr.category] = curr.count;
          return acc;
        }, {} as Record<string, number>);
        setCounts(countsMap);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryClick = (category: string) => {
    router.push(`/courses?category=${encodeURIComponent(category)}`);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const visibleCategories = showAll ? PREDEFINED_CATEGORIES : PREDEFINED_CATEGORIES.slice(0, 5);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2">
              Explore Categories
            </h2>
            <p className="text-gray-500">
              Find the right path for your career growth.
            </p>
          </div>
          
          <button
            onClick={toggleShowAll}
            className="text-[#cb1030] font-bold text-sm hover:underline flex items-center gap-1"
          >
            {showAll ? "View Less Categories" : "View All Categories"}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {visibleCategories.map((cat) => {
            const count = counts[cat.title] || 0; // Default to 0 if no courses
            return (
              <div key={cat.title} onClick={() => handleCategoryClick(cat.title)} className="cursor-pointer">
                <CategoryCard
                  icon={cat.icon}
                  title={cat.title}
                  courseCount={`${count} Courses`}
                  bgColor={cat.bgColor}
                  textColor={cat.textColor}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
