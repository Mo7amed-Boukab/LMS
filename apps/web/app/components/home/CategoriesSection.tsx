import Link from "next/link";
import CategoryCard from "./CategoryCard";

const categories = [
    { icon: "code", title: "Development", courseCount: "120+ Courses", bgColor: "bg-blue-50", textColor: "text-blue-700" },
    { icon: "work", title: "Business", courseCount: "85+ Courses", bgColor: "bg-purple-50", textColor: "text-purple-700" },
    { icon: "palette", title: "Design", courseCount: "64+ Courses", bgColor: "bg-pink-50", textColor: "text-pink-700" },
    { icon: "campaign", title: "Marketing", courseCount: "42+ Courses", bgColor: "bg-orange-50", textColor: "text-orange-700" },
    { icon: "bar_chart", title: "Data Science", courseCount: "38+ Courses", bgColor: "bg-green-50", textColor: "text-green-700" },
];

export default function CategoriesSection() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2">Explore Categories</h2>
                        <p className="text-gray-500">Find the right path for your career growth.</p>
                    </div>
                    <Link className="text-[#cb1030] font-bold text-sm hover:underline flex items-center gap-1" href="#">
                        View All Categories
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.title}
                            icon={category.icon}
                            title={category.title}
                            courseCount={category.courseCount}
                            bgColor={category.bgColor}
                            textColor={category.textColor}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
