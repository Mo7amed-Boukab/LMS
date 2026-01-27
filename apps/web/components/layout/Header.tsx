"use client";

import { GraduationCap, Search, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function Header() {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center size-8 rounded bg-red-700 text-white">
                            <GraduationCap size={20} />
                        </div>
                        <Link href="/" className="text-xl font-bold tracking-tight text-[#1a1a1a]">ED Academy</Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link className="text-sm font-medium text-[#1a1a1a] hover:text-red-700 transition-colors" href="/">
                            Home
                        </Link>
                        <Link className="text-sm font-medium text-[#1a1a1a] hover:text-red-700 transition-colors" href="/courses">
                            Courses
                        </Link>
                        {isAuthenticated && user?.role === 'apprenant' && (
                            <Link className="text-sm font-medium text-[#1a1a1a] hover:text-red-700 transition-colors" href="/my-enrollments">
                                My Enrollments
                            </Link>
                        )}
                        <Link className="text-sm font-medium text-[#1a1a1a] hover:text-red-700 transition-colors" href="/about">
                            About
                        </Link>
                        <Link className="text-sm font-medium text-[#1a1a1a] hover:text-red-700 transition-colors" href="/contact">
                            Contact
                        </Link>
                    </nav>

                    <div className="flex flex-1 justify-end gap-6 items-center">
                        {/* Search Bar */}
                        <div className="hidden lg:flex items-center w-full max-w-xs h-10 rounded border border-gray-200 focus-within:border-red-700/50 transition-colors overflow-hidden">
                            <div className="flex items-center justify-center pl-3 text-gray-500">
                                <Search size={18} />
                            </div>
                            <input
                                className="w-full h-full border-none outline-none text-sm px-3 text-[#1a1a1a] placeholder:text-gray-500"
                                placeholder="Search courses..."
                            />
                        </div>

                        {/* Auth Buttons */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <Link href="/profile" className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#1a1a1a] hover:bg-gray-100 py-2 px-3 rounded transition-colors">
                                    <UserIcon size={18} />
                                    <span>{user?.firstName}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center justify-center py-2 px-4 rounded bg-white border border-gray-200 text-[#1a1a1a] text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                    <LogOut size={16} className="mr-2" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <button className="hidden sm:flex items-center justify-center py-2 px-4 rounded text-sm font-medium text-[#1a1a1a] hover:bg-gray-100 transition-colors">
                                        Log In
                                    </button>
                                </Link>
                                <Link href="/register">
                                    <button className="flex items-center justify-center py-2 px-4 rounded bg-red-700 text-white text-sm font-medium hover:bg-red-800 transition-colors">
                                        Get started
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
