interface FeatureProps {
    icon: string;
    title: string;
    description: string;
    bgColor: string;
    textColor: string;
}

function FeatureCard({ icon, title, description, bgColor, textColor }: FeatureProps) {
    return (
        <div className="flex flex-col items-center text-center p-6">
            <div className={`size-16 rounded-full ${bgColor} ${textColor} flex items-center justify-center mb-6`}>
                <span className="material-symbols-outlined text-3xl">{icon}</span>
            </div>
            <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}

const features = [
    {
        icon: "school",
        title: "Expert Instructors",
        description: "Learn from industry veterans who have worked at top companies like Google, Apple, and Amazon.",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
    },
    {
        icon: "all_inclusive",
        title: "Lifetime Access",
        description: "Buy a course once and keep it forever. Get free updates whenever we refresh the content.",
        bgColor: "bg-gray-50",
        textColor: "text-[#1a1a1a]",
    },
    {
        icon: "schedule",
        title: "Flexible Learning",
        description: "Study at your own pace, on your own time. Our platform is accessible on all devices.",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
    },
];

export default function WhyChooseSection() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] mb-4">Why Choose ED Academy?</h2>
                    <p className="text-gray-500 text-lg">
                        We focus on providing the highest quality education experience to help you achieve your career goals faster.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <FeatureCard
                            key={feature.title}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            bgColor={feature.bgColor}
                            textColor={feature.textColor}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
