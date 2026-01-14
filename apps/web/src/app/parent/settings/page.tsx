"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Spinner,
  Avatar,
} from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

export default function SettingsPage() {
  const { user } = useUser();
  const { data: family, isLoading } = trpc.family.get.useQuery();
  const { data: settings } = trpc.family.getSettings.useQuery();

  const [streakMultipliers, setStreakMultipliers] = useState({
    tier1Days: 3,
    tier1Multiplier: 1.1,
    tier2Days: 7,
    tier2Multiplier: 1.25,
    tier3Days: 14,
    tier3Multiplier: 1.5,
  });

  useEffect(() => {
    if (settings?.streakMultipliers) {
      setStreakMultipliers(settings.streakMultipliers as any);
    }
  }, [settings]);

  const updateSettings = trpc.family.updateSettings.useMutation();

  const handleSaveMultipliers = () => {
    updateSettings.mutate({
      streakMultipliers: {
        tier1: streakMultipliers.tier1Multiplier,
        tier2: streakMultipliers.tier2Multiplier,
        tier3: streakMultipliers.tier3Multiplier,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar
              src={user?.imageUrl}
              fallback={user?.firstName || "U"}
              size="lg"
            />
            <div>
              <p className="font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family Info */}
      <Card>
        <CardHeader>
          <CardTitle>Family</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Family Name</label>
            <p className="font-semibold text-gray-900">
              {family?.name || "My Family"}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Family ID</label>
            <p className="font-mono text-sm text-gray-600">{family?.id}</p>
          </div>
        </CardContent>
      </Card>

      {/* Streak Multipliers */}
      <Card>
        <CardHeader>
          <CardTitle>Streak Multipliers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-gray-500">
            Configure point multipliers for maintaining streaks. Kids earn bonus
            points when they complete tasks consistently.
          </p>

          <div className="space-y-4">
            {/* Tier 1 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tier 1 Days
                </label>
                <input
                  type="number"
                  value={streakMultipliers.tier1Days}
                  onChange={(e) =>
                    setStreakMultipliers((prev) => ({
                      ...prev,
                      tier1Days: parseInt(e.target.value) || 0,
                    }))
                  }
                  min="1"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tier 1 Multiplier
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={streakMultipliers.tier1Multiplier}
                  onChange={(e) =>
                    setStreakMultipliers((prev) => ({
                      ...prev,
                      tier1Multiplier: parseFloat(e.target.value) || 1,
                    }))
                  }
                  min="1"
                  max="3"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Tier 2 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tier 2 Days
                </label>
                <input
                  type="number"
                  value={streakMultipliers.tier2Days}
                  onChange={(e) =>
                    setStreakMultipliers((prev) => ({
                      ...prev,
                      tier2Days: parseInt(e.target.value) || 0,
                    }))
                  }
                  min="1"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tier 2 Multiplier
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={streakMultipliers.tier2Multiplier}
                  onChange={(e) =>
                    setStreakMultipliers((prev) => ({
                      ...prev,
                      tier2Multiplier: parseFloat(e.target.value) || 1,
                    }))
                  }
                  min="1"
                  max="3"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Tier 3 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tier 3 Days
                </label>
                <input
                  type="number"
                  value={streakMultipliers.tier3Days}
                  onChange={(e) =>
                    setStreakMultipliers((prev) => ({
                      ...prev,
                      tier3Days: parseInt(e.target.value) || 0,
                    }))
                  }
                  min="1"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tier 3 Multiplier
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={streakMultipliers.tier3Multiplier}
                  onChange={(e) =>
                    setStreakMultipliers((prev) => ({
                      ...prev,
                      tier3Multiplier: parseFloat(e.target.value) || 1,
                    }))
                  }
                  min="1"
                  max="3"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleSaveMultipliers}
            disabled={updateSettings.isPending}
            isLoading={updateSettings.isPending}
          >
            Save Multipliers
          </Button>

          {updateSettings.isSuccess && (
            <p className="text-sm text-green-600">Settings saved!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
