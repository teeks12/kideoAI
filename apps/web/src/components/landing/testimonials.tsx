import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Our mornings went from chaos to calm. The kids actually race to complete their tasks now!",
    author: "Sarah M.",
    role: "Mom of 3",
    avatar: "SM",
    rating: 5,
  },
  {
    quote:
      "The streak feature is genius. My son hasn't missed a day in 3 weeks because he doesn't want to lose his multiplier.",
    author: "David K.",
    role: "Dad of 2",
    avatar: "DK",
    rating: 5,
  },
  {
    quote:
      "Finally, a chore app that teaches responsibility, not just rewards. The expected vs paid distinction is perfect.",
    author: "Jennifer L.",
    role: "Mom of 4",
    avatar: "JL",
    rating: 5,
  },
  {
    quote:
      "My daughter loves earning badges and checking her progress. It's made her so much more independent.",
    author: "Michael R.",
    role: "Dad of 1",
    avatar: "MR",
    rating: 5,
  },
  {
    quote:
      "We tried 3 other apps before Kideo. This is the only one that stuck. The kids genuinely enjoy using it.",
    author: "Amanda T.",
    role: "Mom of 2",
    avatar: "AT",
    rating: 5,
  },
  {
    quote:
      "The timer feature is a game-changer for reading time. My kids stay focused and actually finish their books.",
    author: "Chris P.",
    role: "Dad of 3",
    avatar: "CP",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Loved by{" "}
              <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Real Families
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Join thousands of parents who&apos;ve transformed their family&apos;s
              approach to chores and responsibility.
            </p>
          </div>

          {/* Testimonial grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-gray-50 p-6 transition-all hover:bg-white hover:shadow-lg"
              >
                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-warning-400 text-warning-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="mb-6 text-gray-700">&ldquo;{testimonial.quote}&rdquo;</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-sm font-semibold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid gap-8 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-white sm:grid-cols-3">
            <div className="text-center">
              <p className="text-4xl font-bold">10,000+</p>
              <p className="text-primary-100">Families Using Kideo</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">500,000+</p>
              <p className="text-primary-100">Tasks Completed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">4.9/5</p>
              <p className="text-primary-100">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
