"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const joinMutation = trpc.waitlist.join.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setEmail("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    joinMutation.mutate({ email });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 bg-white/95 shadow-sm backdrop-blur-sm">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Kideo"
              width={150}
              height={150}
              className="h-18 w-auto object-contain"
            />
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex min-h-screen items-center justify-center px-4 pt-24">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            {!submitted ? (
              <>
                {/* Logo & Heading */}
                <div className="mb-8 text-center">
                  <h1 className="mb-3 text-3xl font-bold text-gray-900">
                    Join the Waitlist
                  </h1>
                  <p className="text-gray-600">
                    Be the first to know when Kideo launches. We&apos;ll send you
                    early access and exclusive updates!
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={joinMutation.isPending}
                      className="w-full"
                    />
                  </div>

                  {joinMutation.error && (
                    <div className="rounded-md bg-error-50 p-3 text-sm text-error-700">
                      {joinMutation.error.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700"
                    disabled={joinMutation.isPending}
                  >
                    {joinMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join the Waitlist"
                    )}
                  </Button>
                </form>

                {/* Trust Signals */}
                <div className="mt-6 space-y-2 text-center text-xs text-gray-500">
                  <p>✓ Free forever plan available</p>
                  <p>✓ No credit card required</p>
                  <p>✓ Unsubscribe anytime</p>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center">
                  <div className="mb-6 flex justify-center">
                    <CheckCircle className="h-16 w-16 text-success-500" />
                  </div>
                  <h2 className="mb-3 text-2xl font-bold text-gray-900">
                    You&apos;re on the list!
                  </h2>
                  <p className="mb-6 text-gray-600">
                    Thank you for joining the Kideo waitlist. We&apos;ll email you
                    as soon as we launch with exclusive early access.
                  </p>
                  <Link href="/">
                    <Button className="bg-gradient-to-r from-primary-600 to-primary-700">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Social Proof */}
          {!submitted && (
            <p className="mt-6 text-center text-sm text-gray-500">
              Join thousands of families building better habits together
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
