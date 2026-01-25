import { Filter, Search, ChevronRight, X, ChevronDown, Monitor, Palette, Briefcase, BarChart, Code2, Users, Star } from "lucide-react";
import Link from "next/link";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CourseCard from "../components/home/CourseCard";

const courses = [
    {
        category: "Business",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTEffddOSEy9TzQWeEYXxRJyyJWa8xu-8luP0ynEbF1TY8eia0LUPcz3bqR_k5di6qDFwuYwAm-wmaVEdQArnvg4EoD71kUoXuQ6OoO9eIHmQomC67Bgy4OpSEHeWq3A38WHvm9dcVVThMyexYovioUMopJEAeQDtfY7w16c44YzTrvaN0K24eCfvVqfwPrYUmEA7ANd9S3OMKbRwg0a18m__YURF26qwPflMiIUmD4TR28LdaHkPVt6cI0fpdvj9jHfPW1xJyy0uM",
        rating: "4.8",
        reviewCount: "120",
        title: "Advanced Strategic Management",
        description: "Master strategic planning and execution.",
        instructorName: "Dr. Eleanor Vance",
        instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAs0MLIvqVWoAD8vjo9-sei19vxotl5mo4rRx4tuKyUEt_ME7pg1j-A3JiB0aegZ83xNOoVprMcckS2waXSv8CpSmaEJaOEOoJeUThdN8BrLc14_hjJhpwoZA0j-L0rnZXKeai9pD-oPk3sBISseGjNZ19fZCjdaWkhyVg42HdM0N9r2i8pg7_VCSIlrPplAtlpGhvgiSd5Ri7veIza6H4cnczxnhc1J3Ar3zMMvsaYJtkLSkn0IjDHq_GWNkEb0NEj00xgHcup8yvf",
        price: "$49.99",
        slug: "advanced-strategic-management",
    },
    {
        category: "Design",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7uNlJirx8Jxn14Rl5K7KlgCrBDtpBn_0aIlOLgHKixGnjsM8U5qdGMC7NAcBe5XP1QBJVj5VpMI_trnBDSTQLbQ6pTKnam_Pt0zrKCHmqN4JmQ54gbeJWCQagg_t4I37Rp-LncygVsEQXFMNOBYVS4O0bud1rXb-uTrBSUj-AUR0R3_W8BOHCAK4xeI-ifAwFOrSn9HD1TQVitKYqSHKlRVQ1kgzs0iC_aeInpAknIV8560FnBiNrgRmNZg-xSyDAjaNq5C3G6ytZ",
        rating: "4.9",
        reviewCount: "3.2k",
        title: "Complete UX/UI Design Masterclass",
        description: "From wireframes to high-fidelity prototypes.",
        instructorName: "Sarah Jenkins",
        instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwQpZ_z6VaahUhaC30dsRnWD3Dz8IONunNdE4hEpOHhis7U8MTgR55Z7BS6TOKjXQMYf3qMtMx-R7ggyDhab65wyvnl_6iywFWQy9lzAJt90ft8WDzi9FBjowSa1zM5bmMrz0pve7CX2a7NthZZ6Rp0YKa03wYYKSZuBcoFcHj47rI5cGkPl7jaEVYgY5ckug6dOtSnlo9u86eKxgpyE5iH2tQ31azVzvNye6i5DQBQIfp2I_dXI10YLYCNBZ7YE86I8TsV7cUZXnK",
        price: "$89.99",
        slug: "ui-ux-design",
    },
    {
        category: "Development",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHdA7sqnXp2l_EMSFdaUhC-U1xxJI2VbK6KMUXsPpJ-_rhbk5QXizjzzH_ikPDQzwQmqDiQHJF7qV6TpsHuC3EMKy04JTSdiIh5EVSUsZ3AzUuJvEaA_8HkwnKukNDh0cO3IYQ1Fg7Z--0tGRIk_slin37xRUW2DPO5D2Uv_fx0Q1sFxQ7MM70KGVIKFFJ3g2ZqNOZ-H1Txi6oyIZSnN6rob1HIW-XDZe40q2FKE-srolpl5B_kb29L3wYuTleE2CHpIJgR3lcusR4",
        rating: "4.7",
        reviewCount: "850",
        title: "Python for Data Science Bootcamp",
        description: "Learn Python for data analysis and visualization.",
        instructorName: "Michael Chen",
        instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLsSBLj4ftsDUHcBb8FoBFYFNU93DAasTRk9eGNn8C7T0GfWL1E-JmoZv-4mGOW8g9ZDV6vEG9-CXLA-xHemMiVvcatskyE1LJESStjT9B3dm7xAykpdamAM61YWnncAmmyqdTDY20nEPfKu5p1LGU2xrBCT8rEoK7CxK4eJ-_PXVepZDQvfKCLDETJP0SmGwWRHnjF_PTQva3EaDBVSLC8j08o6zYrzkRSXvp-QaQTqu6MKlFmk_t_zaFkorcHsC5vq96_KSciEUn",
        price: "$69.99",
        slug: "python-for-data-science-bootcamp",
    },
    {
        category: "Business",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBv5ym9QlyfrP5_KdmYZPoSj-3aMNg97EKr2kuNWCm2DNkg-SBzYoOJolajU-bsT7MYf6sgLrBzBGNOJrdWIf24xhBS2hz4nnnk1nfHNK1wNPBhtjdW_hMmFseVnmUdOlQi8exNLtIgVZXqdmwaWHVEuk8cJl8X9uJn0-xaew2KctSoSo6M0rkiT4ZafrpwLJWu5hIzG0Mt23IIFJgerwA15dCUrRULlV1dFXHPeBo_tOfa0cyEoUG64pqvHGGvGMkwaE4jjG4GdhTb",
        rating: "4.6",
        reviewCount: "210",
        title: "Executive Leadership Principals",
        description: "Lead with confidence and authority.",
        instructorName: "Robert Fox",
        instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAs0MLIvqVWoAD8vjo9-sei19vxotl5mo4rRx4tuKyUEt_ME7pg1j-A3JiB0aegZ83xNOoVprMcckS2waXSv8CpSmaEJaOEOoJeUThdN8BrLc14_hjJhpwoZA0j-L0rnZXKeai9pD-oPk3sBISseGjNZ19fZCjdaWkhyVg42HdM0N9r2i8pg7_VCSIlrPplAtlpGhvgiSd5Ri7veIza6H4cnczxnhc1J3Ar3zMMvsaYJtkLSkn0IjDHq_GWNkEb0NEj00xgHcup8yvf",
        price: "$129.00",
        slug: "executive-leadership-principals",
    },
    {
        category: "Marketing",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfCT1WPuBiUwFDKkhfPP-Tof30yGlGT8qVam4nzG_jM88tU4fl_O7xgNCw5QusdMaZzTXtczVxPdbCn9MlXsBaXEVB53n6JQ_LViPXc90v6SBfo0s9M0pvQ9DvWSB9Trj0IpWhTEOFfBuUIwX_ok9LeQtYRh1OWoMzAV0ebcubJi0Da3GWBDTdWRLjsBm_nqB8ZR6e7PG7Kd9pRMj8sg0p3q2iCO6oQ4hpU5P1iVboW7mMnRKkxUxFtIdInoD19a6dlUimkCpbXtwV",
        rating: "4.5",
        reviewCount: "95",
        title: "Digital Marketing & SEO 2024",
        description: "Master modern digital marketing strategies.",
        instructorName: "Amanda Cooper",
        instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM9fXlgVdkd7B1i2zwS37n0rjfwMv_hLzv5f-OOj8DKCh0Vkp59z4wvLgdMD91NkQUfmbSF_CFUsgZ0EC0FTko-bQCpc2WRrMQ4iO-kD1oKKi5HdM8Su_pnh2_uoTS515LldBgyFiYkDQnx8mDgusPtfwcpwhRbYG2QLvyD7v_acEoTx7lJIRFOrGuvY_tppzYvPBwQc8_uvfEt4TLzSuIXHTvy1_JHWXfIEOG7XCyEKQ5HHA0yzNtK_ceO8Ra0fNV9G1drVni0JUB",
        price: "$34.99",
        slug: "digital-marketing-seo-2024",
    },  
    {
        category: "Development",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKPdl81Rsiejzx8021ceM9VES6y7ZUXGKnM0qyryXQoXiDUDXdEhjonq8id_0sRJtgMlUyPWaJ8f82YW9Jsj10IDZJC1DwlBYiHWLffB24rgPGvH53N9eh_mVLIoo6Dw-O1gy1_k0bnKdXPCDRUaqnnpNee3PKYOfXZSjdqIz47Os7hbV39XPkEd-970s4-DiYGboJL6fNzZxS26STViEv5YEpsR-CRhUk-1s64bCm8UrJQWGkYUZIC1oOmOjtkWSXJJ6prRBcIiUu",
        rating: "5.0",
        reviewCount: "15",
        title: "Rust Programming for Beginners",
        description: "Systems programming made easy.",
        instructorName: "David Kim",
        instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyYEXL6R6xBsFyYp7gzjmZdhrCvjbyuBJVNvwptASJdzZOhhh-sI04sVvR-cWqheSU4_1SFZ271yo2nJ_JPJgVs8oZwuyfulbSNN_vYhg9Iyj1bgWDViYWQpIjdm_aeYfCbtDYBWmBVG6ZjJGSuYRxsHAD4R1x-22RZxYk0fHx_5a6rlB_EVC7tqm4OVxpBLP2hoTJIOB9NsoA3S4jE9OcyViruD8mNRRa_NiLYCZNoXOqDvt0im5th5-Pc5JpfOy5ypVswu9X5V7d",
        price: "$59.99",
        slug: "rust-programming-for-beginners",
    },
    {
        category: "Business",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDG6MlPvwISho9Yb94TDI21wvAOo74U8Fann8hRYQWBinu9FVRcti5V4nGI4bg-BemTaeIYp59QAmbqPWUBNKgM0x2PCf7A2EoFYFhgiU0gjzUbTOLlenzHVOUPnsy1LGR-2ooQ9imJRacOFVIO0N6FmCimj62XDWBqjvSUPxQUxeGHIg_pId6ud8YiuZ-cI5Dt7GfME04oNquJzWms-d7IdnTQM6a98K4vFZVln6sfmNR70o1lWeO5vKPx33Jl_CGN-B057uQ-us3U",
        rating: "4.4",
        reviewCount: "67",
        title: "Human Resources Fundamentals",
        description: "Effective HR strategies for modern businesses.",
        instructorName: "Jennifer Lo",
        instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAM4u0wSgMLsOaAOHVIZWqUrPRq47u_8N3aYF6KXEdn4AXBB3cmOmlEBDwsLGbU0ook1ADym6nJNJxXP3QoNMgnWCoK_lscUVeSHEGyTL06SNptWcoeE_exUsK4IZQS4Fs556Cfyj2XHdVA4svDIia_VEkfP3UHnqH62J4D1x7ZowDB5LRlV7s17PMt0UboANVn8DC25mmlfavRbLqRJccvn7106WexxNsE0abCaxWcgtKAV56Ki2lZpklSkpIqH2i_zmlC7umdM3-g",
        price: "$39.99",
        slug: "human-resources-fundamentals",
    },
    {
        category: "Design",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfKbpJ4KERu__7bZSyZN8HZ0Y9t-QltPku8ykiL74GOKhwG6ArwfUhvYfDhI4tI0oJQXG--Xs5jFhOIestjbRWIqv3Y5Y-U6861vv7_DoVFGoKjTAoahvyLDoaFdlX8IQmRy3voFk2_-rfGJlArdz1DjYR7zSqKBW8Z076QHKlJb6pUhY0bMOLixEt0wZEelboa25I8xcpT5kGXNbZFZnwWUtQlWsiSTaG4HK3BGSVH3QfR68grryqxEVE5x7yf_SG8_B6EvPdCQa5",
        rating: "4.9",
        reviewCount: "410",
        title: "Blender 3D Modeling Deep Dive",
        description: "Create stunning 3D models and animations.",
        instructorName: "Chris Martin",
        instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQo7D3SKZtC2cTKKPbIG-bJ75z7LXUWpV9A9UnNj_paYQCRsQ1IvWWksolRSIv5g1HO5twOb9TUxJb-k5EefGCyx1KnbjsBtkr6q94AHomieA0nQCsU5odUYmO9wBCpIO1f2RS9TPpnykd4mBXIZzoZRJv6rRHGYkFuPVB5TgZgeyV7zPLP6R-Xp6gu9fl89BgvH2ffW9BFElyM9_qRIPB3qeUWBDQRZJGgW5jPilK7hgYn9bEHvX46tW4OLpljXnvPeALpeZpg2xF",
        price: "$64.99",
        slug: "blender-3d-modeling-deep-dive",
    },
];

export default function CoursesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1 w-full bg-white">


                {/* Main Content */}
                <main className="flex-1">
                    {/* Page Header */}
                    <div className="bg-white/95 border-b border-gray-100 px-6 py-6 md:px-10">
                        <div className="max-w-[1370px] mx-auto">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-[#1a1a1a] text-3xl font-bold tracking-tight">Explore Courses</h1>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-500 text-sm font-medium whitespace-nowrap hidden sm:inline">Sort by:</span>
                                    <div className="relative min-w-[180px]">
                                        <select className="appearance-none w-full bg-[#f4f0f1] border-none text-[#1a1a1a] text-sm font-small rounded-sm py-2.5 pl-4 pr-10 focus:ring-1 focus:ring-red-700 cursor-pointer hover:bg-[#ece6e7] transition-colors">
                                            <option>Category</option>
                                            <option>Category 1</option>
                                            <option>Category 2</option>
                                            <option>Category 3</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                            <ChevronDown size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Active Filter Chips */}
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-xs font-bold text-gray-500 mr-1 uppercase tracking-wide">Active:</span>
                                <div className="flex items-center gap-1.5 bg-red-700/10 text-red-700 border border-red-700/20 rounded-full px-3 py-1 transition-colors hover:bg-red-700/20 cursor-pointer group">
                                    <span className="text-xs font-bold">Business</span>
                                    <X size={14} className="group-hover:text-red-800" />
                                </div>
                                <div className="flex items-center gap-1.5 bg-[#f4f0f1] text-[#1a1a1a] border border-[#e6dbdd] rounded-full px-3 py-1 transition-colors hover:bg-[#e6dbdd] cursor-pointer group">
                                    <span className="text-xs font-medium">Expert</span>
                                    <X size={14} className="text-gray-500 group-hover:text-[#1a1a1a]" />
                                </div>
                                <button className="text-xs font-bold text-red-700 hover:underline ml-2">Clear All</button>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="px-6 py-8 md:px-10 min-h-full">
                        <div className="max-w-7xl mx-auto">
                            <p className="text-gray-500 text-sm mb-6">Showing <span className="text-[#1a1a1a] font-bold">12</span> of <span className="text-[#1a1a1a] font-bold">148</span> results</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {courses.map((course) => (
                                    <CourseCard
                                        key={course.title}
                                        category={course.category}
                                        imageUrl={course.imageUrl}
                                        rating={course.rating}
                                        reviewCount={course.reviewCount}
                                        title={course.title}
                                        description={course.description}
                                        instructorName={course.instructorName}
                                        instructorAvatar={course.instructorAvatar}
                                        price={course.price}
                                        slug={course.slug}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center mt-12">
                                <nav className="flex items-center gap-2">
                                    <a className="flex items-center justify-center w-9 h-9 rounded border border-[#e6dbdd] text-gray-500 hover:bg-[#f4f0f1] hover:text-[#1a1a1a] transition-colors" href="#">
                                        <span className="sr-only">Previous</span>
                                        <ChevronRight size={18} className="rotate-180" />
                                    </a>
                                    <a className="flex items-center justify-center w-9 h-9 rounded bg-red-800 text-white font-small shadow-sm" href="#">1</a>
                                    <a className="flex items-center justify-center w-9 h-9 rounded border border-[#e6dbdd] text-[#1a1a1a] font-small text-sm hover:bg-[#f4f0f1] transition-colors" href="#">2</a>
                                    <a className="flex items-center justify-center w-9 h-9 rounded border border-[#e6dbdd] text-[#1a1a1a] font-small text-sm hover:bg-[#f4f0f1] transition-colors" href="#">3</a>
                                    <span className="flex items-center justify-center w-9 h-9 text-gray-500">...</span>
                                    <a className="flex items-center justify-center w-9 h-9 rounded border border-[#e6dbdd] text-[#1a1a1a] font-small text-sm hover:bg-[#f4f0f1] transition-colors" href="#">12</a>
                                    <a className="flex items-center justify-center w-9 h-9 rounded border border-[#e6dbdd] text-gray-500 hover:bg-[#f4f0f1] hover:text-[#1a1a1a] transition-colors" href="#">
                                        <span className="sr-only">Next</span>
                                        <ChevronRight size={18} />
                                    </a>
                                </nav>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
