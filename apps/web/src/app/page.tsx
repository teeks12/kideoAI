import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@kideo/db";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { Benefits } from "@/components/landing/benefits";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default async function HomePage() {
  const { userId } = await auth();

  // Check if user has a family
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        familyMembers: {
          take: 1,
        },
      },
    });

    const hasFamily = !!user?.familyMembers.length;

    // If logged in with a family, redirect to dashboard
    if (hasFamily) {
      return redirect("/parent/dashboard");
    }

    // If logged in but no family, redirect to onboarding
    return redirect("/onboarding");
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // Organization
      {
        "@type": "Organization",
        "@id": "https://kideo.ai/#organization",
        name: "Kideo",
        url: "https://kideo.ai",
        logo: {
          "@type": "ImageObject",
          url: "https://kideo.ai/logo.png",
        },
        sameAs: [
          "https://twitter.com/kideo_app",
        ],
        description: "Kideo helps families build responsibility in kids through gamified chores, rewards, and achievements.",
      },
      // WebSite with search action
      {
        "@type": "WebSite",
        "@id": "https://kideo.ai/#website",
        url: "https://kideo.ai",
        name: "Kideo - Kids Chore & Responsibility App",
        publisher: { "@id": "https://kideo.ai/#organization" },
        inLanguage: "en-US",
      },
      // SoftwareApplication
      {
        "@type": "SoftwareApplication",
        "@id": "https://kideo.ai/#app",
        name: "Kideo",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web, iOS (coming soon)",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "10000",
          bestRating: "5",
          worstRating: "1",
        },
        description: "Help your kids learn responsibility through fun tasks, exciting rewards, and achievements. Build great habits together as a family.",
        featureList: [
          "Age-appropriate task templates for kids 2-18+",
          "Expected vs Paid chores system",
          "Daily streak tracking with point multipliers (1.2x at 3 days, 1.5x at 7+ days)",
          "Parent-approved rewards system",
          "Task timers and beat-the-timer challenges",
          "Badge achievements and milestones",
          "Full parent oversight and approval workflows",
          "Multiple kid profiles under one family account",
        ],
        screenshot: "https://kideo.ai/screenshot.png",
        author: { "@id": "https://kideo.ai/#organization" },
      },
      // FAQPage
      {
        "@type": "FAQPage",
        "@id": "https://kideo.ai/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is Kideo really free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! Kideo offers a free forever plan with all core features including tasks, rewards, streaks, and badges. We believe every family should have access to tools that build responsibility.",
            },
          },
          {
            "@type": "Question",
            name: "What ages is Kideo designed for?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Kideo works for kids ages 2 to 18+. We provide age-appropriate task templates for toddlers (2-3), young kids (4-6), older kids (7-10), and teens (11+). The system grows with your family.",
            },
          },
          {
            "@type": "Question",
            name: "How does the Expected vs Paid chores system work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Expected tasks are responsibilities done because you're part of the family (like making your bed). Paid tasks earn points that can be redeemed for rewards. This teaches kids the difference between family contributions and earning opportunities.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need separate accounts for each child?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Parents create one family account and add kid profiles within it. Each child has their own view, points balance, and task list, but everything is managed under your family account.",
            },
          },
          {
            "@type": "Question",
            name: "Can I approve tasks before points are awarded?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Absolutely! By default, all task completions require parent approval. You can review what your kids have done, approve or reject with optional feedback, and points are only awarded upon approval.",
            },
          },
          {
            "@type": "Question",
            name: "Is my family's data private and secure?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. We use industry-standard security with Clerk authentication. Your family's data is encrypted, never shared with third parties, and you can delete your account and all data at any time.",
            },
          },
          {
            "@type": "Question",
            name: "Will there be a mobile app?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! We're currently web-first to move quickly, but a native iOS app built with React Native is on our roadmap. Your account and data will work seamlessly across both platforms.",
            },
          },
          {
            "@type": "Question",
            name: "How long does it take to set up Kideo?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Most families are up and running in under 5 minutes. Create your account, add kid profiles, choose from our task templates or create custom ones, and you're ready to go!",
            },
          },
        ],
      },
    ],
  };

  // Landing page for non-authenticated users
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <div className="min-h-screen">
        <Navbar />
        <main id="main-content">
          <Hero />
          <Features />
          <HowItWorks />
          {/* Hidden until launch - re-enable later */}
          {/* <Testimonials /> */}
          <Benefits />
          <Pricing />
          <FAQ />
        </main>
        <Footer />
      </div>
    </>
  );
}
