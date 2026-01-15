import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is Kideo really free?",
    answer:
      "Yes! Kideo offers a free forever plan with all core features including AI-powered task suggestions, rewards, streaks, and badges. We believe every family should have access to tools that build responsibility.",
  },
  {
    question: "How does the AI work?",
    answer:
      "Our AI learns your child's age, interests, and habits to suggest age-appropriate tasks and personalized rewards. It adapts as your child grows, making it easier than ever to create meaningful chores and motivating incentives.",
  },
  {
    question: "What ages is Kideo designed for?",
    answer:
      "Kideo works for kids ages 2 to 18+. We provide age-appropriate task templates for toddlers (2-3), young kids (4-6), older kids (7-10), and teens (11+). The system grows with your family.",
  },
  {
    question: "How does the Expected vs Paid chores system work?",
    answer:
      "Expected tasks are responsibilities done because you're part of the family (like making your bed). Paid tasks earn points that can be redeemed for rewards. This teaches kids the difference between family contributions and earning opportunities.",
  },
  {
    question: "Do I need separate accounts for each child?",
    answer:
      "No. Parents create one family account and add kid profiles within it. Each child has their own view, points balance, and task list, but everything is managed under your family account.",
  },
  {
    question: "Can I approve tasks before points are awarded?",
    answer:
      "Absolutely! By default, all task completions require parent approval. You can review what your kids have done, approve or reject with optional feedback, and points are only awarded upon approval.",
  },
  {
    question: "Is my family's data private and secure?",
    answer:
      "Yes. We use industry-standard security with Clerk authentication. Your family's data is encrypted, never shared with third parties, and you can delete your account and all data at any time.",
  },
  {
    question: "Will there be a mobile app?",
    answer:
      "Yes! We're currently web-first to move quickly, but a native iOS app built with React Native is on our roadmap. Your account and data will work seamlessly across both platforms.",
  },
  {
    question: "How long does it take to set up?",
    answer:
      "Most families are up and running in under 5 minutes. Create your account, add kid profiles, choose from our task templates or create custom ones, and you're ready to go!",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20 sm:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl">
          {/* Section header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about Kideo. Can&apos;t find what you&apos;re
              looking for? Contact us anytime.
            </p>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="mb-4 rounded-lg border-none bg-white px-4 shadow-sm sm:px-6"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-primary-600 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="mb-4 text-gray-600">Ready to get started?</p>
            <Link href="/waitlist">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-orange-500 to-purple-500 animate-pulse-glow font-semibold"
              >
                Join the Waitlist
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
