import { Star } from "lucide-react";
import Link from "next/link";

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
  showContinueLearning?: boolean;
  variant?: "grid" | "horizontal";
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
  showContinueLearning = false,
  variant = "grid",
}: CourseCardProps) {
  const href = slug.startsWith("/") ? slug : `/courses/${slug}`;
 
  if (variant === "horizontal") {
    return (
      <div className="group flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-sm hover:border-red-200 hover:bg-red-50/10 transition-all">
        <Link href={href} className="w-full sm:w-40 aspect-video shrink-0 overflow-hidden rounded-sm bg-gray-100 block">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="flex flex-col justify-between py-1 flex-grow">
          <div>
            <div className="flex items-center justify-between mb-1">
               <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">{category}</span>
               <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-bold text-[#1a1a1a]">{rating}</span>
               </div>
            </div>
            <Link href={href}>
              <h4 className="font-bold text-gray-900 line-clamp-1 group-hover:text-red-700 transition-colors">
                {title}
              </h4>
            </Link>
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
              {description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
               <div
                  className="size-5 rounded-full bg-gray-200 bg-cover bg-center"
                  style={{ backgroundImage: `url('${instructorAvatar}')` }}
                ></div>
                <span className="text-[10px] font-medium text-gray-600">
                  {instructorName}
                </span>
            </div>
            {showContinueLearning ? (
              <Link href={href}>
                <button className="bg-red-700 hover:bg-red-800 text-white text-[11px] font-bold px-3 py-1.5 rounded transition-all active:scale-[0.98]">
                  Continue
                </button>
              </Link>
            ) : (
              <span className="text-sm font-bold text-[#cb1030]">{price}</span>
            )}
          </div>
        </div>
      </div>
    );
  }
 
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
 
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{description}</p>
 
        <div className="mt-auto pt-4 border-t border-gray-100">
          {showContinueLearning ? (
            <Link href={href} className="block">
              <button className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 rounded transition-all active:scale-[0.98] shadow-sm text-sm">
                Continue Learning
              </button>
            </Link>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="size-6 rounded-full bg-gray-200 bg-cover bg-center"
                  style={{ backgroundImage: `url('${instructorAvatar}')` }}
                ></div>
                <span className="text-xs font-medium text-gray-600">
                   {instructorName}
                </span>
              </div>
              <span className="text-lg font-bold text-[#cb1030]">{price}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
