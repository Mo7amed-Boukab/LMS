interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  offset?: boolean;
}

function TestimonialCard({
  quote,
  name,
  role,
  avatar,
  offset,
}: TestimonialCardProps) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg hover:bg-white/10 transition-colors ${offset ? "sm:translate-y-6" : ""}`}
    >
      <div className="flex gap-1 text-red-800 mb-4">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="material-symbols-outlined text-[20px] fill-current"
          >
            star
          </span>
        ))}
      </div>
      <blockquote className="text-gray-300 mb-6 text-sm leading-relaxed">
        &quot;{quote}&quot;
      </blockquote>
      <div className="flex items-center gap-3">
        <div
          className="size-10 rounded-full bg-gray-600 bg-cover bg-center"
          style={{ backgroundImage: `url('${avatar}')` }}
        ></div>
        <div>
          <div className="font-bold text-sm">{name}</div>
          <div className="text-xs text-gray-400">{role}</div>
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "The practical projects in the UI/UX course were exactly what I needed to build my portfolio. I landed a job at a design agency two months after finishing!",
    name: "Sarah Jenkins",
    role: "Product Designer",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwQpZ_z6VaahUhaC30dsRnWD3Dz8IONunNdE4hEpOHhis7U8MTgR55Z7BS6TOKjXQMYf3qMtMx-R7ggyDhab65wyvnl_6iywFWQy9lzAJt90ft8WDzi9FBjowSa1zM5bmMrz0pve7CX2a7NthZZ6Rp0YKa03wYYKSZuBcoFcHj47rI5cGkPl7jaEVYgY5ckug6dOtSnlo9u86eKxgpyE5iH2tQ31azVzvNye6i5DQBQIfp2I_dXI10YLYCNBZ7YE86I8TsV7cUZXnK",
  },
  {
    quote:
      "As a career switcher, I was intimidated by coding. The Python track was structured so well that I never felt lost. Highly recommend for beginners.",
    name: "Michael Torres",
    role: "Data Analyst",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAw-7vAvkXSFMHKE9qTjAAunsObmH2_c9sQKZ9k-GTOYv0p9ol75LkI4W0MFkBLhH2JDkOl95tptunOeTtG-r66neNO-TvLllgU8Ke3bT5OjM4pXgp3L0cri1FFMYIXqbqrpdmAPzTeSmspTtYISYl8_gV7l9vGW81Ysq7ZDO52cd0BZbjX1t7phry0iO7qgTP6i8dKdA44qGBtM42-gXcGmAtkowy10zl-SEyzsconYDoCSinVpAWmnFoCUfbfZf68YxfG2clhzDtq",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      {/* Abstract decorative background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-red-800/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gray-700/20 blur-3xl"></div>

      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/3">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight">
              What Our Students Say
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Don&apos;t just take our word for it. Read how ED Academy has
              transformed careers worldwide.
            </p>
            <button className="flex items-center gap-2 text-red-800 font-bold hover:text-white transition-colors">
              View all success stories{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="md:w-2/3 grid gap-6 sm:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
                avatar={testimonial.avatar}
                offset={index === 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
