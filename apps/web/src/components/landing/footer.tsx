import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Kideo"
                width={200}
                height={200}
                className="h-24 w-auto object-contain"
              />
            </div>
            <p className="mb-4 max-w-sm text-gray-600">
              AI-powered chores made fun. Build responsible kids through
              personalized tasks, rewards, and achievements.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="h-4 w-4 fill-error-500 text-error-500" />
              <span>for families everywhere</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#features"
                  className="text-gray-600 transition-colors hover:text-primary-600"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/waitlist"
                  className="text-gray-600 transition-colors hover:text-primary-600"
                >
                  Join Waitlist
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-gray-600 transition-colors hover:text-primary-600"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <span className="cursor-not-allowed text-gray-400">
                  Roadmap (Coming Soon)
                </span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="cursor-not-allowed text-gray-400">
                  About (Coming Soon)
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed text-gray-400">
                  Blog (Coming Soon)
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed text-gray-400">
                  Support (Coming Soon)
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed text-gray-400">
                  Contact (Coming Soon)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">
              © {currentYear} Kideo. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="#"
                className="text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-500 transition-colors hover:text-gray-900"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
