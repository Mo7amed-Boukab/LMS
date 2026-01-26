import CourseCard from "./CourseCard";

const courses = [
    {
        category: "Development",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyYEXL6R6xBsFyYp7gzjmZdhrCvjbyuBJVNvwptASJdzZOhhh-sI04sVvR-cWqheSU4_1SFZ271yo2nJ_JPJgVs8oZwuyfulbSNN_vYhg9Iyj1bgWDViYWQpIjdm_aeYfCbtDYBWmBVG6ZjJGSuYRxsHAD4R1x-22RZxYk0fHx_5a6rlB_EVC7tqm4OVxpBLP2hoTJIOB9NsoA3S4jE9OcyViruD8mNRRa_NiLYCZNoXOqDvt0im5th5-Pc5JpfOy5ypVswu9X5V7d",
        rating: "4.9",
        reviewCount: "2.4k",
        title: "Advanced React Patterns & Performance",
        description: "Master modern React with hooks, context, and performance optimization techniques.",
        instructorName: "Alex R.",
        instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB47L5E5URHbhAaE8ZNin6Zgjm2JWMn-vw8dF_4DSmV9La1PO9LeWVyn7ucN40g6-2sAlwIAbbjDGzWeY1fL-9I3TVuRcpC_Fr89HDvPf1-YuHF0YDRKHtJ1Up79dsiDOg3hGT3V_Asv4ewwRK9ODuixxfKuOtNm-yggl6a-AeH2NWXnzvKe4FWfIKghe8wyW31X8Xzz1DWT06vzb6P8WLw5QNqunSMs4oXKWCb9kdxjoWv6VTHEImzMrMIZCG5AjyUyPEC0-JKFfap",
        price: "$89.99",
    },
    {
        category: "Business",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDefeL_2Nb9SvVxiL5BlsXL7BUL8zEBB_sbT2UE6W8gw1bpPUOHUXhsTqGk8PQrG-wltpTe91-Zhz4VM62l5IzOvjXlJAxS_OOIFc5fvoUgRJrkFJLvW4Rd6lsZydFDyNkYoPuHuWqcYKCZyDWFlh2zUpxd6CQvQrCeBrKXM_f2YYXGME9jFzB8g6UAZ4bd7GU2rscs5-n7qgHr3y-qp5wMUH2H58nG-QqHBHjNToK6vo6UhaeCFiv1kfw4KCfDebVvdgIbbacwT45A",
        rating: "4.8",
        reviewCount: "1.1k",
        title: "Strategic Leadership for Managers",
        description: "Learn to lead teams effectively and make high-stakes business decisions.",
        instructorName: "Sarah J.",
        instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAs0MLIvqVWoAD8vjo9-sei19vxotl5mo4rRx4tuKyUEt_ME7pg1j-A3JiB0aegZ83xNOoVprMcckS2waXSv8CpSmaEJaOEOoJeUThdN8BrLc14_hjJhpwoZA0j-L0rnZXKeai9pD-oPk3sBISseGjNZ19fZCjdaWkhyVg42HdM0N9r2i8pg7_VCSIlrPplAtlpGhvgiSd5Ri7veIza6H4cnczxnhc1J3Ar3zMMvsaYJtkLSkn0IjDHq_GWNkEb0NEj00xgHcup8yvf",
        price: "$74.99",
    },
    {
        category: "Design",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyYCqewFTgf9HXKZ4jmXBmuZE7UaKkIbpjYFFGDDpf5i-4hHouxpwdSmaA4DgoNjKP3N-g3PZVQyzpGf7mkX9cyCJc4e0iINPBzJlwtVIDB0j7m1srxlr870fNdNrHOV7abneyvs1yKASv_Hduhd4VO_oGqQweoFq8BWTGQY_uRWDZTdBd0dtRIQaKwuySHSrV52sbMeAzNpyHd9adD9fyRdmT8tBrjcMuuAqdpL8Q9CVG56ePNKIcqKOJDFz_NkHzB4PuFp2IhJRp",
        rating: "5.0",
        reviewCount: "850",
        title: "UI/UX Fundamentals & Prototyping",
        description: "From wireframes to high-fidelity prototypes using Figma and Adobe XD.",
        instructorName: "Marcus L.",
        instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQo7D3SKZtC2cTKKPbIG-bJ75z7LXUWpV9A9UnNj_paYQCRsQ1IvWWksolRSIv5g1HO5twOb9TUxJb-k5EefGCyx1KnbjsBtkr6q94AHomieA0nQCsU5odUYmO9wBCpIO1f2RS9TPpnykd4mBXIZzoZRJv6rRHGYkFuPVB5TgZgeyV7zPLP6R-Xp6gu9fl89BgvH2ffW9BFElyM9_qRIPB3qeUWBDQRZJGgW5jPilK7hgYn9bEHvX46tW4OLpljXnvPeALpeZpg2xF",
        price: "$94.99",
    },
    {
        category: "Data Science",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdfn39qa6OjixJAW4kYwFoIW-F3H_sQo8IZY_uxrMmmOkEdjblGvoSlhtKzftSNpRxp6x1BbZ5w0g2L4_o30F981smbfbmFgX0iIbJd_LpB-RykcUwdqFGQH0mkDImN85oZwrjjiP8fwO9hKHdQauDu9Z2mKiFtyHnxt6Hke1GHV-7S1sYob-VPtO4JhBaWixM4LmV_humislTUVyKUdM9WdtVLMHrxiar3I7UdSM2jHChSaiemcjLNCK7v8rJLqp_0i2h2AkttCFu",
        rating: "4.7",
        reviewCount: "3.2k",
        title: "Python for Data Science Bootcamp",
        description: "Analyze data, create visualizations, and build ML models from scratch.",
        instructorName: "Emily W.",
        instructorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLsSBLj4ftsDUHcBb8FoBFYFNU93DAasTRk9eGNn8C7T0GfWL1E-JmoZv-4mGOW8g9ZDV6vEG9-CXLA-xHemMiVvcatskyE1LJESStjT9B3dm7xAykpdamAM61YWnncAmmyqdTDY20nEPfKu5p1LGU2xrBCT8rEoK7CxK4eJ-_PXVepZDQvfKCLDETJP0SmGwWRHnjF_PTQva3EaDBVSLC8j08o6zYrzkRSXvp-QaQTqu6MKlFmk_t_zaFkorcHsC5vq96_KSciEUn",
        price: "$69.99",
    },
];

export default function PopularCoursesSection() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2">Popular Courses</h2>
                        <p className="text-gray-500">Highest rated courses by our students this month.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
