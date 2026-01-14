"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, Button, Spinner } from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [familyName, setFamilyName] = useState("");
  const [error, setError] = useState("");
  const utils = trpc.useUtils();

  // Check if user already has a family
  const { data: existingFamily, isLoading: checkingFamily } = trpc.family.get.useQuery(undefined, {
    retry: false,
  });

  // Create family mutation
  const createFamily = trpc.family.create.useMutation({
    onSuccess: async () => {
      // Invalidate the family query to refetch
      await utils.family.get.invalidate();
      // Use hard redirect to ensure navigation happens
      window.location.href = "/parent/dashboard";
    },
    onError: (err) => {
      setError(err.message || "Failed to create family");
    },
  });

  // Redirect if user already has a family
  if (existingFamily) {
    window.location.href = "/parent/dashboard";
    return null;
  }

  if (!isLoaded || checkingFamily) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName.trim()) {
      setError("Please enter a family name");
      return;
    }

    setError("");
    createFamily.mutate({ name: familyName.trim() });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="mx-auto max-w-md pt-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Kideo!</h1>
          <p className="mt-2 text-gray-600">
            Hi {user?.firstName || "there"}! Let&apos;s set up your family.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Family</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateFamily} className="space-y-4">
              <div>
                <label
                  htmlFor="familyName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Family Name
                </label>
                <input
                  id="familyName"
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="The Smith Family"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  disabled={createFamily.isPending}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={createFamily.isPending}
                isLoading={createFamily.isPending}
              >
                Create Family
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-gray-500">
          You can invite other parents to your family later from settings.
        </p>
      </div>
    </div>
  );
}
