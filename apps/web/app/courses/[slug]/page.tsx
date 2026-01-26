import { Star, Clock, BarChart, Globe, RefreshCw, CheckCircle, PlayCircle, Lock, FileText, Monitor, Download, Infinity, Smartphone, Award, Share2, Gift, Play, Users } from "lucide-react";
import Link from "next/link";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export default function CourseDetailsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative bg-[#1a1a1a]">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBrVLh01DohL903CxyBu7x05LYNSmwKyQmzgl8F385wGj3FOzVBHlTEYfq5q1JtxkJ_H8QR848NaBu3B8V5KuFupCkI-ZbAeA09b29SANUun7bUDTUdtP1JWSjELV2naFhiDPcCThwsFMsuGnbtgaI3TldHazP72RcgxncEm89Ox2itm4fSHxtiy7_-r6J4PQlcuW4Hwoi6z34a9Y9USf1VGotfwEgstpiJYW7ojZX8BW250lnTaUE8wAxfvapaZGKDictWCKXZgEIF')" }}
                    ></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-12">
                        <div className="max-w-3xl">
                            {/* Breadcrumbs inside Hero */}
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-6 font-medium">
                                <Link className="hover:text-white transition-colors" href="/courses">Design</Link>
                                <span>›</span>
                                <span className="text-white">UI/UX Design Masterclass</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
                                UI/UX Design Masterclass: From Beginner to Pro
                            </h1>
                            <p className="text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed">
                                Master the art of user interface and user experience design with this comprehensive course. Learn Figma, prototyping, wireframing, and design theory.
                            </p>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-8">
                                <div className="flex items-center gap-2">
                                    <Clock size={20} />
                                    <span>24 Weeks</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BarChart size={20} />
                                    <span>All Levels</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe size={20} />
                                    <span>English</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RefreshCw size={20} />
                                    <span>Last updated May 2024</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <span className="bg-[#f6c344] text-black text-xs font-bold px-2 py-0.5 rounded-[3px]">Bestseller</span>
                                    <div className="flex items-center gap-1 text-[#f6c344]">
                                        <span className="font-bold text-sm">4.8</span>
                                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                    <span className="text-gray-300 text-sm">(1,204 ratings)</span>
                                    <span className="text-white text-sm">12,500 students</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    <img alt="Instructor Sarah" className="w-10 h-10 rounded-full border-2 border-[#1a1a1a] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDOD5bgnQpHIMPuXv_HPYVGkPT_Rq4_NGDMYF-yg9eIvfIv8P923ZPOl6MvLovfLo-gdHysnRxqtxveoKshOqpc4E230-E1gDzV62xUsaLPA8lKDrfQlIY1naI7CnAv2bcJ92nzWVyGk-ZcfKxaFAav0x_It1TUhM0p6K_ddMtAMKVaj-Edjz_qJxTqrHQnBiYRkSSqfNGamCcNom0ylAP4EpfJ4q6xoTycTKTJ0BmGL-T9QSFMctYatvV_017k-RcfFv980iWmOrh" />
                                    <img alt="Instructor Mike" className="w-10 h-10 rounded-full border-2 border-[#1a1a1a] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7Olvg3abarBhjBaAFObOABsJzhdIzdgR9I7I-eP1chn0uVhZQoRIv2jLLlvmARiG5PITNg8Rgdqse7P8cbBRpfMNOwwvrfAuwucw4fKveKPpwKaIL9K9Pqb9BRXXCelcdG1UVyVXNYPZ6xVs6HLXBTwlhOSxIwckQHPKysQ8y-rZTGoAjfv2UXd3vvSzYvkyfhb0O92G4qIKaon5Lt17a0wobXtx4TAFKdch37JZc1ur-kliUPEtH62U8-I-OXRzxNGURTs1jzq_V" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300">Created by <a className="text-white font-bold hover:underline" href="#">Sarah Jenkins</a> & <a className="text-white font-bold hover:underline" href="#">Mike Chen</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Two Column Layout */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8 relative">
                        {/* Left Content Column */}
                        <div className="flex-1 min-w-0">
                            {/* Tabs Navigation */}
                            <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-[#f4f0f1] mb-8">
                                <div className="flex overflow-x-auto no-scrollbar gap-8">
                                    <a className="whitespace-nowrap py-4 border-b-[3px] border-[#cb1030] text-[#cb1030] font-bold text-sm" href="#overview">Overview</a>
                                    <a className="whitespace-nowrap py-4 border-b-[3px] border-transparent text-[#896168] hover:text-[#181112] transition-colors font-bold text-sm" href="#curriculum">Curriculum</a>
                                    <a className="whitespace-nowrap py-4 border-b-[3px] border-transparent text-[#896168] hover:text-[#181112] transition-colors font-bold text-sm" href="#instructor">Instructor</a>
                                    <a className="whitespace-nowrap py-4 border-b-[3px] border-transparent text-[#896168] hover:text-[#181112] transition-colors font-bold text-sm" href="#reviews">Reviews</a>
                                </div>
                            </div>

                            {/* Overview Section */}
                            <div className="mb-12 scroll-mt-32" id="overview">
                                <h2 className="text-2xl font-bold mb-6 text-[#181112]">About this course</h2>
                                <div className="prose prose-lg text-[#896168] mb-8">
                                    <p>
                                        This masterclass is designed to take you from a complete beginner to a job-ready UI/UX designer. We focus heavily on the "why" behind design decisions, not just the tools. You will learn to conduct user research, create wireframes, design high-fidelity mockups, and build interactive prototypes.
                                    </p>
                                </div>
                                {/* What you'll learn card */}
                                <div className="bg-[#f4f0f1] rounded-md p-6 lg:p-8 border border-gray-100">
                                    <h3 className="text-lg font-bold mb-4 text-[#181112]">What you'll learn</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            "Master Figma for UI design and prototyping",
                                            "Understand User Experience (UX) principles",
                                            "Build a professional design portfolio",
                                            "Conduct user research and usability testing",
                                            "Learn to hand off designs to developers",
                                            "Design systems and component libraries"
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-3 items-start">
                                                <CheckCircle className="text-[#cb1030] mt-0.5" size={20} />
                                                <span className="text-sm text-[#181112]">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Curriculum Section */}
                            <div className="mb-12 scroll-mt-32" id="curriculum">
                                <div className="flex justify-between items-end mb-6">
                                    <h2 className="text-2xl font-bold text-[#181112]">Course Curriculum</h2>
                                    <span className="text-sm text-[#896168]">6 Sections • 42 Lectures • 12h 30m</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {/* Section 1 */}
                                    <details className="group bg-white rounded border border-gray-200 overflow-hidden" open>
                                        <summary className="flex cursor-pointer items-center justify-between p-4 bg-[#f4f0f1]/50 hover:bg-[#f4f0f1] transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="transition-transform group-open:rotate-180 text-[#896168]">▼</span>
                                                <h3 className="font-bold text-[#181112]">Section 1: Introduction to UI/UX</h3>
                                            </div>
                                            <span className="text-xs font-bold text-[#896168]">45m</span>
                                        </summary>
                                        <div className="p-0 border-t border-gray-100">
                                            <div className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <PlayCircle className="text-[#896168]" size={18} />
                                                    <span className="text-sm text-[#181112]">What is UI vs UX?</span>
                                                </div>
                                                <span className="text-xs text-[#cb1030] font-medium">Preview</span>
                                            </div>
                                            <div className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <Lock className="text-[#896168]" size={18} />
                                                    <span className="text-sm text-[#181112]">Tools of the trade</span>
                                                </div>
                                                <span className="text-xs text-[#896168]">15:20</span>
                                            </div>
                                            <div className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="text-[#896168]" size={18} />
                                                    <span className="text-sm text-[#181112]">Course Resources</span>
                                                </div>
                                                <span className="text-xs text-[#896168]">PDF</span>
                                            </div>
                                        </div>
                                    </details>

                                    {/* Section 2 */}
                                    <details className="group bg-white rounded-md border border-gray-200 overflow-hidden">
                                        <summary className="flex cursor-pointer items-center justify-between p-4 bg-[#f4f0f1]/50 hover:bg-[#f4f0f1] transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="transition-transform group-open:rotate-180 text-[#896168]">▼</span>
                                                <h3 className="font-bold text-[#181112]">Section 2: Getting Started with Figma</h3>
                                            </div>
                                            <span className="text-xs font-bold text-[#896168]">2h 15m</span>
                                        </summary>
                                        <div className="p-4 text-sm text-[#896168]">
                                            Requires enrollment to view contents.
                                        </div>
                                    </details>

                                    {/* Section 3 */}
                                    <details className="group bg-white rounded-md border border-gray-200 overflow-hidden">
                                        <summary className="flex cursor-pointer items-center justify-between p-4 bg-[#f4f0f1]/50 hover:bg-[#f4f0f1] transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="transition-transform group-open:rotate-180 text-[#896168]">▼</span>
                                                <h3 className="font-bold text-[#181112]">Section 3: Design Principles & Typography</h3>
                                            </div>
                                            <span className="text-xs font-bold text-[#896168]">3h 10m</span>
                                        </summary>
                                        <div className="p-4 text-sm text-[#896168]">
                                            Requires enrollment to view contents.
                                        </div>
                                    </details>
                                </div>
                            </div>

                            {/* Instructor Section */}
                            <div className="mb-12 scroll-mt-32" id="instructor">
                                <h2 className="text-2xl font-bold mb-6 text-[#181112]">Meet Your Instructors</h2>
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-md border border-gray-200 bg-white">
                                        <div className="shrink-0">
                                            <img alt="Sarah Jenkins" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBslOWBgDb_uqLzcWxRvXcWs4dIat-UauNLm8_8JsyghzIvl6wGNR9jX6LWfDTPLi2z9Rvlq9DsNNeA2JpzBrcuP7EzqwgjhiN5RSBWTVnDMlZXpyITTBgn6AtXrGJG3toz2umkNzJRnkyIwgszcnvm2msbRv_cjAmu6SiM8giFYX0I0W9Z42HjO7P_hqy7eg1l6VROgnTRy2_pyL1dPGneGpquH9lQAnNCes428CipzUncSKBxBLbnVMUPIwD1XEQJ0SEXYsdwK_Hn" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[#181112]">Sarah Jenkins</h3>
                                            <p className="text-[#cb1030] font-medium text-sm mb-3">Senior Product Designer at Google</p>
                                            <div className="flex gap-4 text-xs text-[#896168] mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Star size={16} fill="currentColor" />
                                                    <span>4.9 Instructor Rating</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users size={16} />
                                                    <span>45,200 Students</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-[#896168] leading-relaxed">
                                                Sarah is a passionate designer with over 10 years of experience in the tech industry. She loves breaking down complex concepts into simple, actionable steps for her students.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="scroll-mt-32" id="reviews">
                                <h2 className="text-2xl font-bold mb-6 text-[#181112]">Student Reviews</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Review Card 1 */}
                                    <div className="p-5 rounded-md bg-[#f4f0f1]">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="size-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                                JD
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-[#181112]">John Doe</h4>
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                                </div>
                                            </div>
                                            <span className="ml-auto text-xs text-[#896168]">2 days ago</span>
                                        </div>
                                        <p className="text-sm text-[#181112]">
                                            The best course I've taken this year. The Figma section was incredibly detailed.
                                        </p>
                                    </div>
                                    {/* Review Card 2 */}
                                    <div className="p-5 rounded-md bg-[#f4f0f1]">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="size-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                                                AL
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-[#181112]">Anna Lee</h4>
                                                <div className="flex text-yellow-400">
                                                    {[...Array(4)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                                    <Star size={14} />
                                                </div>
                                            </div>
                                            <span className="ml-auto text-xs text-[#896168]">1 week ago</span>
                                        </div>
                                        <p className="text-sm text-[#181112]">
                                            Great content, but I wish there were more examples on mobile design. Still worth it!
                                        </p>
                                    </div>
                                </div>
                                <button className="mt-6 w-full py-3 rounded-md border border-gray-200 font-bold text-sm text-[#181112] hover:bg-[#f4f0f1] transition-colors">
                                    View all reviews
                                </button>
                            </div>
                        </div>

                        {/* Right Sidebar (Sticky) */}
                        <div className="w-full lg:w-[360px] shrink-0">
                            <div className="sticky top-24 z-20">
                                <div className="bg-white rounded-md shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
                                    {/* Preview Image */}
                                    <div className="relative aspect-video group cursor-pointer bg-black">
                                        <img alt="Course Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNZC5MIJyw3jdepglb7hBE8IZtQgtM4_EklnuzAbXnIPn_-Ok3UqWGzGXI55OlpZeAsm8gh-XN2Ih6Q-hCVeniEiQ0VWJOrdhHSN0bo7eQjD-dpOwDRPJOqqdpX-Dk1tGYu5WFwT_SBASSHgsowFwXRuJF5V3HjXNTLmtsLk8DiJTcSv9Fwne30rPle13K_OFPgu4lLb_v1GbDeH-Je2akbac3H2-dcxTtJra-z5WRA1QJhEI8NKn_EB9T_Jxk7W65UOZXvHJ2fi5J" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="size-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform group-hover:scale-110">
                                                <Play size={32} fill="currentColor" className="text-white" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 left-0 w-full text-center">
                                            <span className="text-white font-bold text-sm drop-shadow-md">Preview this course</span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="text-2xl font-black text-[#181112]">199.00 DH</span>
                                            <span className="text-lg font-base text-[#896168] line-through decoration-[#cb1030] decoration-2">199.00 DH</span>
                                            <span className="px-2 py-1 bg-[#cb1030]/10 text-[#cb1030] text-xs font-bold rounded">50% OFF</span>
                                        </div>
                                        <button className="w-full py-3 px-4 bg-[#cb1030] hover:bg-[#a00d26] text-white rounded font-bold text-sm shadow-[0_0_15px_rgba(203,16,48,0.15)] transition-all active:scale-[0.98] mb-3">
                                            Enroll Now
                                        </button>
                                        <button className="w-full py-2.5 px-4 bg-transparent border border-gray-200 hover:border-[#cb1030] text-[#181112] hover:text-[#cb1030] rounded font-bold text-sm transition-all mb-6">
                                            Add to Favorites
                                        </button>
                                        <div className="text-center text-xs text-[#896168] mb-6">
                                            30-Day Money-Back Guarantee
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-sm text-[#181112]">This course includes:</h4>
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-3 text-sm text-[#896168]">
                                                    <Monitor size={20} />
                                                    <span>12 hours on-demand video</span>
                                                </li>
                                                <li className="flex items-center gap-3 text-sm text-[#896168]">
                                                    <Download size={20} />
                                                    <span>65 downloadable resources</span>
                                                </li>
                                                <li className="flex items-center gap-3 text-sm text-[#896168]">
                                                    <Infinity size={20} />
                                                    <span>Full lifetime access</span>
                                                </li>
                                                <li className="flex items-center gap-3 text-sm text-[#896168]">
                                                    <Smartphone size={20} />
                                                    <span>Access on mobile and TV</span>
                                                </li>
                                                <li className="flex items-center gap-3 text-sm text-[#896168]">
                                                    <Award size={20} />
                                                    <span>Certificate of completion</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 p-4 flex justify-between items-center">
                                        <button className="text-sm font-bold text-[#181112] hover:underline flex items-center gap-2">
                                            <Share2 size={16} /> Share
                                        </button>
                                        <button className="text-sm font-bold text-[#181112] hover:underline flex items-center gap-2">
                                            <Gift size={16} /> Gift this course
                                        </button>
                                    </div>
                                </div>
                                {/* Mini Promo */}
                                <div className="mt-6 p-4 rounded-md bg-[#f4f0f1] border border-dashed border-gray-300 text-center">
                                    <p className="text-sm font-bold text-[#181112] mb-1">Training 5 or more people?</p>
                                    <p className="text-xs text-[#896168]">Get your team access to ED Academy's top 2,000+ courses.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
