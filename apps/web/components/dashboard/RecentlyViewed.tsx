"use client";

const courses = [
    {
        id: 1,
        title: "Calculus II: Integrals",
        department: "Math Dept",
        instructor: "Dr. Smith",
        progress: 72,
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&auto=format&fit=crop&q=60",
    },
    {
        id: 2,
        title: "Organic Chemistry",
        department: "Science Dept",
        instructor: "Prof. Lee",
        progress: 28,
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&auto=format&fit=crop&q=60",
    },
];

export default function RecentlyViewed() {
    return (
        <div>
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-lg font-bold text-gray-900">Recently Viewed</h3>
                <a className="text-sm font-semibold text-primary hover:text-red-700 flex items-center gap-1" href="#">
                    View All <span className="material-symbols-outlined text-sm">chevron_right</span>
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 items-center"
                    >
                        <div
                            className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${course.image}')` }}
                        ></div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
                                {course.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                                {course.department} • {course.instructor}
                            </p>
                            <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gray-800 rounded-full"
                                    style={{ width: `${course.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
