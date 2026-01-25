export default function HeroSection() {
    return (
        <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="flex flex-col gap-6 max-w-2xl">

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1a1a1a] leading-[1.15]">
                            Elevate Your Career with <span className="text-red-700">World-Class</span> Education
                        </h1>

                        <p className="text-md text-gray-600 leading-relaxed max-w-lg">
                            Master in-demand skills with industry experts. Join over 10,000 learners achieving their goals with ED Academy&apos;s premium curriculum.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <button className="h-10 px-6 py-2 rounded bg-red-700 text-white font-medium hover:bg-red-800 text-sm transition-colors">
                                Explore Courses
                            </button>
                            <button className="h-10 px-6 py-2 rounded border border-gray-300 bg-white text-[#1a1a1a] font-medium text-sm hover:bg-gray-50 transition-colors">
                                Learn More
                            </button>
                        </div>

                        <div className="flex items-center gap-4 pt-4 text-sm text-gray-500">
                            <div className="flex -space-x-2">
                                <div className="size-8 rounded-full border-2 border-white bg-gray-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAn7DYNCSPx5YEWv5IerIAQGksaxHLDusEKkQPv_bz7e20MLpA5jfLTPA4Nq0MRserntC-oi7IoxkJl2DMMFEzsIebUmhlevOxarHKLzyDoGQwtSgY-2IplL-axlchoUhIxGIQPecwJUneQSzlHxhC6yk00SCxsjloZpkiCkMJwocrdfiiU3mxlrtjv-yIm2cJvrIVjtsPda9uES69ieKw6k_Ss4OOEeyihkciHNQ2X7h4UziCWE9LM9vyehJAZmFOZDRcg19HIh2wL')" }}></div>
                                <div className="size-8 rounded-full border-2 border-white bg-gray-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDM9fXlgVdkd7B1i2zwS37n0rjfwMv_hLzv5f-OOj8DKCh0Vkp59z4wvLgdMD91NkQUfmbSF_CFUsgZ0EC0FTko-bQCpc2WRrMQ4iO-kD1oKKi5HdM8Su_pnh2_uoTS515LldBgyFiYkDQnx8mDgusPtfwcpwhRbYG2QLvyD7v_acEoTx7lJIRFOrGuvY_tppzYvPBwQc8_uvfEt4TLzSuIXHTvy1_JHWXfIEOG7XCyEKQ5HHA0yzNtK_ceO8Ra0fNV9G1drVni0JUB')" }}></div>
                                <div className="size-8 rounded-full border-2 border-white bg-gray-200 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAM4u0wSgMLsOaAOHVIZWqUrPRq47u_8N3aYF6KXEdn4AXBB3cmOmlEBDwsLGbU0ook1ADym6nJNJxXP3QoNMgnWCoK_lscUVeSHEGyTL06SNptWcoeE_exUsK4IZQS4Fs556Cfyj2XHdVA4svDIia_VEkfP3UHnqH62J4D1x7ZowDB5LRlV7s17PMt0UboANVn8DC25mmlfavRbLqRJccvn7106WexxNsE0abCaxWcgtKAV56Ki2lZpklSkpIqH2i_zmlC7umdM3-g')" }}></div>
                                <div className="size-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">+2k</div>
                            </div>
                            <p>Join our community today</p>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-[#cb1030]/10 to-gray-200 rounded-2xl blur-2xl opacity-70"></div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-100 aspect-[4/3] group">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAKPdl81Rsiejzx8021ceM9VES6y7ZUXGKnM0qyryXQoXiDUDXdEhjonq8id_0sRJtgMlUyPWaJ8f82YW9Jsj10IDZJC1DwlBYiHWLffB24rgPGvH53N9eh_mVLIoo6Dw-O1gy1_k0bnKdXPCDRUaqnnpNee3PKYOfXZSjdqIz47Os7hbV39XPkEd-970s4-DiYGboJL6fNzZxS26STViEv5YEpsR-CRhUk-1s64bCm8UrJQWGkYUZIC1oOmOjtkWSXJJ6prRBcIiUu')" }}></div>

                            {/* Floating Badge */}
                            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur rounded-lg border border-white/20 shadow-lg flex items-center gap-4">
                                <div className="flex items-center justify-center size-10 rounded-full bg-green-100 text-green-600">
                                    <span className="material-symbols-outlined">check_circle</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#1a1a1a]">Certified Excellence</p>
                                    <p className="text-xs text-gray-500">Accredited by top tech companies</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
