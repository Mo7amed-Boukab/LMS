import Link from "next/link";

interface CategoryCardProps {
    icon: string;
    title: string;
    courseCount: string;
    bgColor: string;
    textColor: string;
}

export default function CategoryCard({ icon, title, courseCount, bgColor, textColor }: CategoryCardProps) {
    return (
        <Link className="group flex flex-col items-center justify-center p-6 rounded border border-gray-200 bg-white hover:border-[#cb1030]/30 hover:shadow-lg hover:shadow-[#cb1030]/5 transition-all" href="#">
            <div className={`size-12 rounded-full ${bgColor} ${textColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <h3 className="font-bold text-[#1a1a1a] group-hover:text-[#cb1030] transition-colors">{title}</h3>
            <p className="text-xs text-gray-400 mt-1">{courseCount}</p>
        </Link>
    );
}
