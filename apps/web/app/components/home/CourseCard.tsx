import Link from "next/link";
import { Star } from "lucide-react";

interface CourseCardProps {
    category: string;
    imageUrl: string;
    rating: string;
    reviewCount: string;
    title: string;
    description: string;
    instructorName: string;
    instructorAvatar: string;
    price: string;
    slug?: string;
}

export default function CourseCard({
    category,
    imageUrl,
    rating,
    reviewCount,
    title,
    description,
    instructorName,
    instructorAvatar,
    price,
    slug = "#",
}: CourseCardProps) {
    const href = slug.startsWith("/") ? slug : `/courses/${slug}`;

    return (
        <div className="group bg-white rounded-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            <Link href={href} className="relative aspect-video overflow-hidden block">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                ></div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-[#1a1a1a] shadow-sm">
                    {category}
                </div>
            </Link>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-bold text-[#1a1a1a]">{rating}</span>
                    <span className="text-xs text-gray-400">({reviewCount} reviews)</span>
                </div>

                <Link href={href}>
                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-2 group-hover:text-[#cb1030] transition-colors line-clamp-2">
                        {title}
                    </h3>
                </Link>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className="size-6 rounded-full bg-gray-200 bg-cover bg-center"
                            style={{ backgroundImage: `url('${instructorAvatar}')` }}
                        ></div>
                        <span className="text-xs font-medium text-gray-600">{instructorName}</span>
                    </div>
                    <span className="text-lg font-bold text-[#cb1030]">{price}</span>
                </div>
            </div>
        </div>
    );
}
