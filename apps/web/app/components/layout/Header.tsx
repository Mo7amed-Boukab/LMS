import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center size-8 rounded bg-red-700 text-white">
                            <GraduationCap size={20} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#1a1a1a]">ED Academy</span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link className="text-sm font-medium text-[#1a1a1a] hover:text-red-700 transition-colors" href="#">
                            Home
                        </Link>
                        <Link className="text-sm font-medium text-[#1a1a1a] hover:text-red-700 transition-colors" href="#">
                            Courses
                        </Link>
                        <Link className="text-sm font-medium text-[#1a1a1a] hover:text-red-700 transition-colors" href="#">
                            About
                        </Link>
                        <Link className="text-sm font-medium text-[#1a1a1a] hover:text-red-700 transition-colors" href="#">
                            Contact
                        </Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <button className="hidden sm:flex items-center justify-center py-2 px-4 rounded text-sm font-medium text-[#1a1a1a] hover:bg-gray-100 transition-colors">
                            Log In
                        </button>
                        <button className="flex items-center justify-center py-2 px-4 rounded bg-red-700 text-white text-sm font-medium hover:bg-red-800 transition-colors">
                            Get started
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
